import jwt from 'jsonwebtoken';

const payload = {
  phoneCountryCode: '+48',
  phoneNumber: '+48575675255',
  message: 'asd esssaa',
  userId: 111313,
  isOptedIn: true,
};

const secret =
  'C5S_jWGWp0rKHRln0MJCZTjBmdcdKAfTCN0qVqc0jNTCA9Q2RDRUV3FM8a1nDcLM';

const token = jwt.sign(payload, secret, { expiresIn: '1h' });

console.log(token);
