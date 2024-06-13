const db = {
  users: [
    {
      id: 1,
      username: 'testuser',
      password: 'password',
      email: 'test@example.com',
    },
  ],
  messages: [],
  emails: [],
  subscriptions: [],
};

export const authenticateUser = async (username, password) => {
  return (
    db.users.find(
      user => user.username === username && user.password === password,
    ) || null
  );
};

export const saveMessage = async message => {
  const newMessage = { ...message, id: db.messages.length + 1, status: 'sent' };
  db.messages.push(newMessage);
  return newMessage;
};

export const saveEmail = async email => {
  const newEmail = { ...email, id: db.emails.length + 1, status: 'sent' };
  db.emails.push(newEmail);
  return newEmail;
};

export const changeSubscriptionStatus = async (userId, optedIn) => {
  const user = db.users.find(user => user.id === userId);
  if (user) {
    user.optedIn = optedIn;
    return user;
  }
  throw new Error('User not found');
};

export const generateReport = async (startDate, endDate) => {
  return db.messages
    .filter(
      msg =>
        new Date(msg.sentAt) >= new Date(startDate) &&
        new Date(msg.sentAt) <= new Date(endDate),
    )
    .reduce((acc, msg) => {
      acc[msg.status] = (acc[msg.status] || 0) + 1;
      return acc;
    }, {});
};
