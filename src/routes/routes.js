import messageController from '../controllers/messageController.js';
import mailController from '../controllers/mailController.js';
import subscriptionController from '../controllers/subscriptionController.js';
import reportController from '../controllers/reportController.js';
import authenticationController from '../controllers/authenticationController.js';
import authenticateToken from '../middleware/authenticationMiddleware.js';
import errorHandler from '../middleware/errorHandler.js';

const setupRoutes = app => {
  app.use('/mail', mailController);
  app.use('/auth', authenticationController);
  app.use(authenticateToken);
  app.use('/message', messageController);
  app.use('/subscription', subscriptionController);
  app.use('/report', reportController);
  app.use(errorHandler);
};

export default setupRoutes;
