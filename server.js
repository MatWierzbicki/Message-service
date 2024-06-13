import express from 'express';
import initializeDatabase from '../message-service/src/database/database.js';
import setupRoutes from '../message-service/src/routes/routes.js';
import errorHandler from './src/middleware/errorHandler.js';

const app = express();
app.use(express.json());

initializeDatabase()
  .then(() => {
    setupRoutes(app);
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Error during database initialization:', err);
  });

app.use(errorHandler);
