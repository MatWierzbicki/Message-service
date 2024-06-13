import formData from 'form-data';
import Mailgun from 'mailgun.js';
import dotenv from 'dotenv';

dotenv.config();

const mailgun = new Mailgun(formData);
const DOMAIN = process.env.MAILGUN_DOMAIN;
const apiKey = process.env.MAILGUN_API_KEY;
const mg = mailgun.client({
  username: 'api',
  key: apiKey,
  url: 'https://api.mailgun.net',
});

export { mg, DOMAIN };
