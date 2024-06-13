import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dbService from '../service/dbService.js';

export async function registerUser(username, password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await dbService.insert(
      'users',
      ['username', 'password'],
      [username, hashedPassword],
    );
  } catch (error) {
    console.error('User registration error:', error);
    throw new Error('User registration error');
  }
}

export async function loginUser(username, password) {
  try {
    const users = await dbService.select(
      'users',
      ['*'],
      `WHERE username = '${username}'`,
    );
    if (users.length === 0) {
      throw new Error('User not found');
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    return { token };
  } catch (error) {
    next(error);
  }
}
