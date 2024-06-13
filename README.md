# Message Service Application

## Description

The Message Service app is a server-side Node.js application that lets you manage sending SMS messages with Twilio and emails with Mailgun. The application also allows you to manage user subscriptions and generate reports on sent messages. It supports both real database connections and mock data for development and testing purposes.

## Technologies

- Node.js
- Express.js
- PostgreSQL (ElephantSQL)
- Twilio API
- Mailgun API
- JWT (JSON Web Tokens)
- Bcrypt

## Configuration

To run the application, you need to set up environment variables. Create a `.env` file in the root directory of the project with the following content:

- PORT=5001
- TWILIO_SID=Your_Twilio_SID
- TWILIO_AUTH_TOKEN=Your_Twilio_Auth_Token
- TWILIO_PHONE_NUMBER=Your_Twilio_Phone_Number
- DB_HOST=Your_Database_Host
- DB_PORT=5432
- DB_USER=Your_Database_Username
- DB_PASSWORD=Your_Database_Password
- DB_NAME=Your_Database_Name
- JWT_SECRET=Your_JWT_Secret
- MAILGUN_API_KEY=Your_Mailgun_API_Key
- MAILGUN_DOMAIN=Your_Mailgun_Domain
- MAIL_FROM=Your_Mail_From_Address

### Obtaining Configuration Data

- **Twilio**: Sign up at [Twilio](https://www.twilio.com/) and navigate to the console dashboard to find your SID, Auth Token, and register a phone number.
- **Mailgun**: Register at [Mailgun](https://www.mailgun.com/) to obtain an API key and configure your domain.
- **PostgreSQL**: Set up a PostgreSQL database either locally or through a service like [ElephantSQL](https://www.elephantsql.com/), and note down the necessary connection details.

## Running the Application

### Production Mode

To run the application in production mode, use the command below:

- npm start

### Development Mode

For application development and launch with automatic reload after code changes, use:

- npm run dev

## Database Configuration and Fallback

The application requires a connection to a PostgreSQL database to operate fully. However, if the database is not configured or the connection fails, the application will use mock data. This allows you to test and develop the application without needing a fully set up database.

## Features

### Receiving a JWT token

The Message Service application uses JSON web tokens (JWT) to authenticate users. To receive the token, go to the folder: `message-service/tests/jwttest` and use the command by the terminal:

- node jwttest

**Please note that the JWT code you receive is only valid for 1 hour.**

### Authentication

To log in and access protected routes within the application, users must authenticate themselves by sending a POST request to the `/auth/login` endpoint. This process verifies user credentials.

Sample data is available in the folder `src/test-data/auth-tests.json`.

The token provided in the response must be included in the Authorization header as a Bearer token for all subsequent API requests that require authentication.

**Example of using the token in a request:**
Authorization: Bearer <Your Token Here>

### Sending Emails

To send emails, send a POST request to the `/mail/send-email` endpoint. Include the required data as specified in `src/test-data/mail-tests.json`. Make sure to provide the JWT obtained from the login process in the Authorization header.

To test the email sending rate limiter and cron job functionality, attempt to send two emails within one minute.

### Sending SMS

Similar to email, send SMS by making a POST request to the `/message/send` endpoint with details specified in `src/test-data/sms-tests.json`. Include the JWT in the Authorization header.

To test the SMS sending rate limiter and cron job functionality, attempt to send two SMS messages within one minute.

### Subscription

To manage subscriptions, the application provides two main endpoints:

1. **Subscribe**: To subscribe and start receiving messages, users must send a POST request to the `/subscription/subscribe/:userId` endpoint. This action sets the user's `optedIn` status to `true`.

   **Example request:**

   ```http
   POST /subscription/subscribe/150
   {
     "optedIn": true
   }
   ```

2. **Unsubscribe**: To unsubscribe and stop receiving messages, users must send a PATCH request to the `/subscription/unsubscribe/:userId` endpoint. This action sets the user's `optedIn` status to `false`.

   **Example request:**

   ```http
   PATCH /subscription/unsubscribe/150
   {
     "optedIn": false
   }
   ```

### Generating a Report

To generate a report, users need to make a GET request to the `/report/messages` endpoint, specifying the start and end dates for the report.

**Query Parameters:**

- `startDate`: The starting date for the report in YYYY-MM-DD format.
- `endDate`: The ending date for the report in YYYY-MM-DD format.

**Example request:**
GET /report/messages?startDate=2023-01-01&endDate=2023-01-31

## Testing

To ensure the quality and reliability of the application, unit tests are implemented using Jest and Supertest. To run the tests, use the following command:

- npm test

## Author

**Mateusz Wierzbicki**

- [LinkedIn](https://www.linkedin.com/in/mateusz-wierzbicki99/)
- [GitHub](https://github.com/MatWierzbicki)
- Email: m.wierzbicki199@gmail.com
