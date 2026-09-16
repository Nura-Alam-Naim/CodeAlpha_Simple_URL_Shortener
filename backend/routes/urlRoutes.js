const express = require('express');
const router = express.Router();
const {
    shortenUrl,
    getStats,
    getAllUrls,
    deleteUrl,
    deactivateUrl,
    activateUrl
} = require('../controllers/urlController');
const { validateUrlInput } = require('../middleware/validator');
const shortenLimiter = require('../middleware/rateLimiter');

// POST /api/shorten
router.post('/shorten', shortenLimiter, validateUrlInput, shortenUrl);

// GET /api/urls
router.get('/urls', getAllUrls);

// GET /api/stats/:shortCode
router.get('/stats/:shortCode', getStats);

// DELETE /api/urls/:shortCode (Hard Delete)
router.delete('/urls/:shortCode', deleteUrl);

// PUT /api/urls/:shortCode/deactivate
router.put('/urls/:shortCode/deactivate', deactivateUrl);

// PUT /api/urls/:shortCode/activate
router.put('/urls/:shortCode/activate', activateUrl);

module.exports = router;
