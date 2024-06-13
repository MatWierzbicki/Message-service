import express from 'express';
import { sendEmail } from '../service/mailService.js';

const router = express.Router();

router.post('/send-email', async (req, res, next) => {
  try {
    const { email, to, subject, message } = req.body;
    const result = await sendEmail(email, to, subject, message, true);
    res.status(200).json({ message: 'Email processing started', data: result });
  } catch (error) {
    console.error('Failed to send email:', error);
    next(error);
  }
});

export default router;
