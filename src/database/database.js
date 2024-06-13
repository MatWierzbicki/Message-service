import { dbPool } from '../database/postgreSQL.js';
import * as dbMock from '../database/dbMock.js';

let db;

const initializeDatabase = async () => {
  try {
    await dbPool.connect();
    console.log('Connected to the real database.');
    db = dbPool;
  } catch (error) {
    console.error(
      'Failed to connect to the database, using mock database instead.',
    );
    db = dbMock;
  }
};

export const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized.');
  }
  return db;
};

export default initializeDatabase;
