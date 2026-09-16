const express = require('express');
const router = express.Router();
const {
    shortenUrl,
    getStats,
    getAllUrls,
    deleteUrl
} = require('../controllers/urlController');
const { validateUrlInput } = require('../middleware/validator');
const shortenLimiter = require('../middleware/rateLimiter');

// POST /api/shorten
router.post('/shorten', shortenLimiter, validateUrlInput, shortenUrl);

// GET /api/urls
router.get('/urls', getAllUrls);

// GET /api/stats/:shortCode
router.get('/stats/:shortCode', getStats);

// DELETE /api/urls/:shortCode
router.delete('/urls/:shortCode', deleteUrl);

module.exports = router;
