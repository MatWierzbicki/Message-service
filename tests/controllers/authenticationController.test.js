import request from 'supertest';
import express from 'express';
import authenticationController from '../../src/controllers/authenticationController.js';
import { dbPool } from '../../src/database/postgreSQL.js';
import bcrypt from 'bcrypt';

jest.mock('../../src/database/postgreSQL.js');

const app = express();
app.use(express.json());
app.use('/auth', authenticationController);

describe('Authentication Controller', () => {
  it('should login user successfully', async () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      password: await bcrypt.hash('password', 10),
    };

    dbPool.query.mockResolvedValue({ rows: [mockUser] });

    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'password' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should return error for invalid credentials', async () => {
    dbPool.query.mockResolvedValue({ rows: [] });

    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'wrongpassword' });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });
});
