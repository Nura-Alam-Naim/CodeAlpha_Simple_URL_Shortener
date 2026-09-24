require('dotenv').config();
const express = require('express');
const cors = require('cors');
const urlRoutes = require('./routes/urlRoutes');
const authRoutes = require('./routes/authRoutes');
const { redirectUrl } = require('./controllers/urlController');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', urlRoutes);

// Redirect Route (must come after API routes to avoid capturing /api)
app.get('/:shortCode', redirectUrl);

// 404 handler
app.use((req, res, next) => {
    res.status(404);
    next(new Error(`Not Found - ${req.originalUrl}`));
});

// Centralized error handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Trigger restart 2
