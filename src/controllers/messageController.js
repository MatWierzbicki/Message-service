import express from 'express';
import { sendMessage } from '../service/messageService.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

const validateMessage = [
  body('phoneCountryCode')
    .matches(/^\+[0-9]{1,3}$/)
    .withMessage('Invalid phoneCountryCode'),
  body('phoneNumber').isMobilePhone().withMessage('Invalid phoneNumber'),
  body('message').notEmpty().withMessage('Message is required'),
  body('userId').notEmpty().withMessage('userId is required'),
  body('isOptedIn').isBoolean().withMessage('isOptedIn must be a boolean'),
];

router.post('/message', validateMessage, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { phoneCountryCode, phoneNumber, message, userId, isOptedIn } =
      req.body;
    const result = await sendMessage(phoneNumber, message, userId);
    res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
