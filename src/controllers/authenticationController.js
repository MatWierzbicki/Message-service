import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { dbPool } from '../database/postgreSQL.js';

const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await dbPool.query(
      'SELECT * FROM users WHERE username = $1',
      [username],
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ token });
  } catch (error) {
    next(error);
  }
});

export default router;
