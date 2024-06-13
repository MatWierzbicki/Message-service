import dbService from '../service/dbService.js';

export async function addSubscription(userId, optedIn) {
  try {
    const booleanOptedIn = optedIn === true || optedIn === 'true';
    await dbService.insert(
      'subscriptions',
      ['userId', 'optedIn'],
      [userId, booleanOptedIn],
    );
  } catch (error) {
    console.error('Error in addSubscription:', error);
    throw error;
  }
}

export async function changeSubscription(userId, optedIn) {
  try {
    const booleanOptedIn = optedIn === true || optedIn === 'true';
    await dbService.update(
      'subscriptions',
      { optedIn: booleanOptedIn },
      'userId = $1',
      [userId],
    );
  } catch (error) {
    console.error('Error in changeSubscription:', error);
    throw error;
  }
}

export async function checkSubscriptionStatus(userId) {
  try {
    const result = await dbService.select(
      'subscriptions',
      ['optedIn'],
      'WHERE userId = $1',
      [userId],
    );
    if (result.length > 0) {
      return result[0].optedin === true;
    }
    return false;
  } catch (error) {
    console.error('Error in checkSubscriptionStatus:', error);
    throw error;
  }
}
