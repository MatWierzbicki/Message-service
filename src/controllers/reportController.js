import express from 'express';
import { generateReport } from '../service/reportService.js';

const router = express.Router();

router.get('/report/messages', async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const report = await generateReport(startDate, endDate);
    res.json(report);
  } catch (error) {
    next(error);
  }
});

export default router;
