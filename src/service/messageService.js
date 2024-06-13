import twilio from 'twilio';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import dbService from './dbService.js';
import cron from 'node-cron';
import { checkSubscriptionStatus } from './subscriptionService.js';

dotenv.config();

const twilioSID = process.env.TWILIO_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(twilioSID, twilioAuthToken);

export async function sendMessage(phoneNumber, message, userId) {
  const oneMinuteAgo = new Date(new Date().getTime() - 60000);

  // Sprawdź status subskrypcji
  const isSubscribed = await checkSubscriptionStatus(userId);

  if (!isSubscribed) {
    const messagesLastMinute = await dbService.select(
      'events',
      ['id'],
      `WHERE phoneNumber = $1 AND userId = $2 AND sentAt >= $3`,
      [phoneNumber, userId, oneMinuteAgo.toISOString()],
    );

    if (messagesLastMinute.length >= 2) {
      await logAttempt(phoneNumber, message);
      cron.schedule(
        '*/1 * * * *',
        async () => {
          console.log('Cron job triggered to send delayed SMS');
          await sendSMSNow(phoneNumber, message, userId);
        },
        {
          scheduled: true,
          timezone: 'Europe/Warsaw',
        },
      );

      return {
        success: false,
        message:
          'Message limit reached. Message scheduled for the next minute.',
      };
    }
  }

  return await sendSMSNow(phoneNumber, message, userId);
}

async function sendSMSNow(phoneNumber, message, userId) {
  try {
    const response = await client.messages.create({
      to: phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER,
      body: message,
    });
    const messageId = uuidv4();
    const sentAt = new Date().toISOString();
    await dbService.insert(
      'events',
      ['id', 'userId', 'phoneNumber', 'message', 'sentAt', 'status'],
      [messageId, userId, phoneNumber, message, sentAt, 'sent'],
    );
    return { messageId, status: 'sent', sentAt };
  } catch (error) {
    console.error(`Error in sendSMSNow: ${error.message}`);
    throw error;
  }
}

async function logAttempt(phoneNumber, message) {
  const attemptedAt = new Date().toISOString();
  const attemptId = uuidv4();
  const errorMessage = 'Message limit reached, attempt logged.';

  await dbService.insert(
    'sms_attempts',
    ['id', 'sms_to', 'attempted_at', 'error_message'],
    [attemptId, phoneNumber, attemptedAt, errorMessage],
  );
}
