# URL Shortener

This is a full-stack, production-quality URL Shortener web application. It features a modern, responsive Glassmorphism UI and supports both authenticated users and anonymous guest sessions.

## Features

- **User Authentication**: Secure user registration and login using JWT and bcrypt.
- **Guest Support**: Anonymous users can create and manage shortened URLs using session tracking without needing an account.
- **Advanced Dashboard**: View click statistics, recent IP logs, and toggle URLs on/off.
- **Custom Aliases**: Create custom shortened links (e.g., `/my-link`).
- **QR Code Generation**: Automatically generates a downloadable QR code for every shortened link.
- **Expiration Dates**: Optionally set shortened URLs to expire after a certain number of days.
- **Analytics**: Tracks total clicks, timestamps, IP addresses, and user-agent strings.
- **Security**: Rate limiting on API routes to prevent abuse, and strict input validation.

## Tech Stack

- **Frontend**: React.js (Vite), Vanilla CSS (Glassmorphism design system)
- **Backend**: Node.js, Express.js
- **Database**: MySQL (using `mysql2` with parameterized queries)
- **Authentication**: JSON Web Tokens (JWT) & bcrypt

## Getting Started

### Prerequisites
- Node.js
- MySQL Server

### 1. Database Configuration
1. Open your MySQL terminal or GUI and execute the schema file to create the database and tables:
   ```bash
   mysql -u root -p < backend/db/schema.sql
   ```
2. Navigate to the `backend` directory, install dependencies, and configure your environment:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```
3. Open `backend/.env` and update your database credentials (`DB_USER`, `DB_PASSWORD`) and set a secure `JWT_SECRET`.

### 2. Frontend Configuration
Navigate to the `frontend` directory and install dependencies:
```bash
cd ../frontend
npm install
```

### 3. Run the Application
A concurrently script is provided in the root directory to start both servers easily:
```bash
# Return to the root directory
cd ..
npm install
npm run dev
```

- The React frontend will be available at `http://localhost:5173`
- The Express backend API will be available at `http://localhost:5000`

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login to receive a JWT
- `GET /api/auth/me` - Get current user profile
- `POST /api/shorten` - Create a new shortened URL
- `GET /:shortCode` - Redirect to original URL
- `GET /api/urls` - Get paginated list of user/guest URLs
- `GET /api/stats/:shortCode` - Get click analytics for a specific URL
- `PUT /api/urls/:shortCode/activate` - Start tracking a stopped URL
- `PUT /api/urls/:shortCode/deactivate` - Stop a URL from redirecting
- `DELETE /api/urls/:shortCode` - Permanently delete a URL and its analytics
