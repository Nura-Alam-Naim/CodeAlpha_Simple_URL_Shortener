# CodeAlpha URL Shortener

This is a full-stack, production-quality URL Shortener web application built for the CodeAlpha Backend Development Internship (Task 1).

## Architecture & Tech Stack

- **Backend**: Node.js + Express.js API
- **Frontend**: React (Vite) Single Page Application
- **Database**: MySQL (using `mysql2` and parameterized queries)
- **Styling**: Vanilla CSS with modern, glassmorphism design elements

## Implemented "Necessary Additions"

1. **Rate Limiting**: `express-rate-limit` is used on `POST /api/shorten` to prevent spam/abuse (Max 20 requests / 15 mins).
2. **Input Validation**: `express-validator` ensures all inputs (URLs, custom aliases, expiry times) are strictly validated before hitting the database.
3. **QR Code Generation**: The `qrcode` package dynamically generates a base64 Data URL for shortened links, displayed and copyable in the frontend.
4. **CORS**: Correctly configured to isolate the API and allow frontend origins.
5. **Centralized Error Handling**: A unified Express error-handling middleware ensures all exceptions return a consistent JSON shape.

## Setup Instructions

### 1. Database Setup
Ensure you have MySQL installed and running locally.
```bash
cd backend
npm install
# Copy the env template and set your DB password (e.g. N@im2002)
cp .env.example .env
# Create the database and schema
npm run init-db
```

### 2. Run the Application (Frontend & Backend)
We use `concurrently` in the root folder to start both the backend API and the React frontend simultaneously with a single command.

```bash
# In the root project directory (CodeAlpha_Simple_URL_Shortener)
npm install
npm run dev
```

- The backend API runs on `http://localhost:5001`
- The React frontend runs on `http://localhost:5173`

## API Documentation

### `POST /api/shorten`
Shortens a URL.
- **Body**: `{ "url": "https://example.com", "customCode": "optional-alias", "expiresInDays": 7 }`
- **Response**: `{ "shortUrl": "...", "originalUrl": "...", "shortCode": "...", "expiresAt": "...", "qrCode": "..." }`

### `GET /:shortCode`
Redirects to the original URL and tracks the click (IP & User Agent).
- **Response**: `302 Redirect` or `404/410 Not Found/Expired`

### `GET /api/urls?page=1&limit=10&search=`
Fetches paginated, searchable URLs for the dashboard table.
- **Response**: `{ "data": [...], "page": 1, "limit": 10, "total": 5, "totalPages": 1 }`

### `DELETE /api/urls/:shortCode`
Soft-deletes a shortened URL so it no longer functions.
- **Response**: `{ "message": "URL deleted successfully" }`

### `GET /api/stats/:shortCode`
Retrieves click logs and analytics for a single URL.
- **Response**: URL object plus `recent_logs` array.

## Testing the Flow
You can use the provided automated script to test the backend API flow without the UI.
```bash
cd backend
node testFlow.js
```
Or simply open the React app in your browser and use the interface!
