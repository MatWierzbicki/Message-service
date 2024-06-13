import express from 'express';
import {
  changeSubscription,
  addSubscription,
} from '../service/subscriptionService.js';

const router = express.Router();

router.post('/subscribe/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { optedIn } = req.body;

    if (!userId || isNaN(userId)) {
      console.error('Invalid userId');
      return res
        .status(400)
        .json({ success: false, message: 'Invalid userId' });
    }

    await addSubscription(userId, optedIn);
    res.status(200).json({ success: true, message: 'Subscribed successfully' });
  } catch (error) {
    next(error);
  }
});

router.patch('/subscribe/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { optedIn } = req.body;

    if (!userId || isNaN(userId)) {
      console.error('Invalid userId');
      return res
        .status(400)
        .json({ success: false, message: 'Invalid userId' });
    }

    await changeSubscription(userId, optedIn);
    res.status(200).json({
      success: true,
      message: 'Subscription status changed successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
