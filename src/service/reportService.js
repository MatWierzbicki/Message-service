import dbService from '../service/dbService.js';

export async function generateReport(startDate, endDate) {
  try {
    return await dbService.select(
      'messages',
      ['status', 'COUNT(*) AS count'],
      `WHERE sentAt >= '${startDate}' AND sentAt <= '${endDate}' GROUP BY status`,
    );
  } catch (error) {
    next(error);
  }
}
