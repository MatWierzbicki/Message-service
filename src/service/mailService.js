import dotenv from 'dotenv';
import cron from 'node-cron';
import { mg, DOMAIN } from '../config/mailConfig.js';
import dbService from './dbService.js';

dotenv.config();

export async function sendEmail(
  email,
  to,
  subject,
  message,
  delayUntilNextDay = true,
) {
  try {
    const lastEmail = await dbService.select(
      'emails',
      ['sent_at'],
      `WHERE email_to = '${to}' ORDER BY sent_at DESC LIMIT 1`,
    );

    if (
      lastEmail.length > 0 &&
      (new Date() - new Date(lastEmail[0].sent_at)) / 60000 < 1
    ) {
      const errorMessage =
        'Email limit exceeded, only one email per minute allowed.';

      await dbService.insert(
        'email_attempts',
        ['email_to', 'attempted_at', 'error_message'],
        [to, new Date(), errorMessage],
      );

      if (delayUntilNextDay) {
        cron.schedule(
          '* * * * *',
          async () => {
            try {
              sendEmail(email, to, subject, message, false);
            } catch (e) {
              console.error('Error resending email from cron job:', e);
            }
          },
          {
            scheduled: true,
            timezone: 'Europe/Warsaw',
          },
        );
        return {
          success: false,
          message: 'Email scheduled for the next minute due to rate limit.',
        };
      }
      throw new Error(errorMessage);
    }

    const data = {
      from: process.env.MAIL_FROM,
      to: to,
      subject: subject,
      text: message,
    };

    const response = await mg.messages.create(DOMAIN, data);
    await dbService.insert(
      'emails',
      ['email_to', 'email_from', 'subject', 'message', 'status', 'sent_at'],
      [to, process.env.MAIL_FROM, subject, message, 'Sent', new Date()],
    );

    return { success: true, data: response };
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw new Error(error.message);
  }
}
