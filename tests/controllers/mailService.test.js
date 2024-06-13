import { sendEmail } from '../../src/service/mailService.js';
import dbService from '../../src/service/dbService.js';
import { mg, DOMAIN } from '../../src/config/mailConfig.js';

jest.mock('../../src/service/dbService.js');
jest.mock('../../src/config/mailConfig.js', () => ({
  mg: {
    messages: {
      create: jest.fn(),
    },
  },
  DOMAIN: 'test.domain',
}));

describe('Mail Service', () => {
  it('should send an email successfully', async () => {
    dbService.select.mockResolvedValue([]);
    mg.messages.create.mockResolvedValue({
      id: '123',
      message: 'Queued. Thank you.',
    });

    const result = await sendEmail(
      'postmaster@sandbox50029a957e214b128dacd394d30f9019.mailgun.org',
      'to@test.com',
      'Test Subject',
      'Test Message',
    );

    expect(result.success).toBe(true);
    expect(mg.messages.create).toHaveBeenCalledWith('test.domain', {
      from: 'postmaster@sandbox50029a957e214b128dacd394d30f9019.mailgun.org',
      to: 'to@test.com',
      subject: 'Test Subject',
      text: 'Test Message',
    });
    expect(dbService.insert).toHaveBeenCalled();
  });

  it('should handle email rate limit', async () => {
    dbService.select.mockResolvedValue([{ sent_at: new Date().toISOString() }]);
    dbService.insert.mockResolvedValue({});

    const result = await sendEmail(
      'postmaster@sandbox50029a957e214b128dacd394d30f9019.mailgun.org',
      'to@test.com',
      'Test Subject',
      'Test Message',
    );

    expect(result.success).toBe(false);
    expect(result.message).toBe(
      'Email scheduled for the next minute due to rate limit.',
    );
  });
});
