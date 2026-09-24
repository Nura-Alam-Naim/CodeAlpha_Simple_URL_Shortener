const QRCode = require('qrcode');
const { nanoid } = require('nanoid');
const UrlModel = require('../models/urlModel');

const shortenUrl = async (req, res, next) => {
    try {
        const { url, customCode, expiresInDays } = req.body;
        const userId = req.user ? req.user.id : null;
        const sessionId = !userId ? req.headers['x-session-id'] : null;

        // Check if there's already an active one for this exact url
        const existingActive = await UrlModel.findByOriginalUrl(url, userId, sessionId);
        if (existingActive && !customCode) {
            // Generate QR Code
            const shortUrl = `${req.protocol}://${req.get('host')}/${existingActive.short_code}`;
            const qrCode = await QRCode.toDataURL(shortUrl);
            
            return res.status(200).json({
                shortUrl,
                originalUrl: existingActive.original_url,
                shortCode: existingActive.short_code,
                expiresAt: existingActive.expires_at,
                qrCode
            });
        }

        let shortCode = customCode;
        if (shortCode) {
            const exists = await UrlModel.findByShortCode(shortCode);
            if (exists) {
                res.status(400);
                throw new Error('Custom code is already in use');
            }
        } else {
            // Generate unique code
            let isUnique = false;
            while (!isUnique) {
                shortCode = nanoid(7);
                const exists = await UrlModel.findByShortCode(shortCode);
                if (!exists) isUnique = true;
            }
        }

        let expiresAt = null;
        if (expiresInDays) {
            const date = new Date();
            date.setDate(date.getDate() + parseInt(expiresInDays, 10));
            expiresAt = date;
        }

        await UrlModel.create(shortCode, url, expiresAt, userId, sessionId);

        const shortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;
        const qrCode = await QRCode.toDataURL(shortUrl);

        res.status(201).json({
            shortUrl,
            originalUrl: url,
            shortCode,
            expiresAt,
            qrCode
        });
    } catch (error) {
        next(error);
    }
};

const redirectUrl = async (req, res, next) => {
    try {
        const { shortCode } = req.params;
        const urlEntry = await UrlModel.findByShortCode(shortCode);

        if (!urlEntry) {
            return res.status(404).send('URL not found');
        }

        if (!urlEntry.is_active) {
            return res.status(410).send('URL has been deleted or deactivated');
        }

        if (urlEntry.expires_at && new Date() > new Date(urlEntry.expires_at)) {
            await UrlModel.deactivate(urlEntry.id);
            return res.status(410).send('URL has expired');
        }

        // Increment count and log click
        await UrlModel.incrementClickCount(urlEntry.id);
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const userAgent = req.get('User-Agent') || '';
        await UrlModel.logClick(urlEntry.id, ip, userAgent);

        res.redirect(302, urlEntry.original_url);
    } catch (error) {
        next(error);
    }
};

const getStats = async (req, res, next) => {
    try {
        const { shortCode } = req.params;
        const stats = await UrlModel.getStats(shortCode);

        if (!stats) {
            res.status(404);
            throw new Error('URL not found');
        }

        res.status(200).json(stats);
    } catch (error) {
        next(error);
    }
};

const getAllUrls = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const offset = (page - 1) * limit;
        const userId = req.user ? req.user.id : null;
        const sessionId = !userId ? req.headers['x-session-id'] : null;

        const result = await UrlModel.getAll(limit, offset, search, userId, sessionId);

        res.status(200).json({
            data: result.urls,
            page,
            limit,
            total: result.total,
            totalPages: Math.ceil(result.total / limit)
        });
    } catch (error) {
        next(error);
    }
};

const deleteUrl = async (req, res, next) => {
    try {
        const { shortCode } = req.params;
        const userId = req.user ? req.user.id : null;
        const sessionId = !userId ? req.headers['x-session-id'] : null;
        const urlEntry = await UrlModel.findByShortCode(shortCode);

        if (!urlEntry) {
            res.status(404);
            throw new Error('URL not found');
        }

        const isOwner = (userId && urlEntry.user_id === userId) || (!userId && urlEntry.user_id === null && urlEntry.session_id === sessionId);
        if (!isOwner) {
            res.status(403);
            throw new Error('Unauthorized');
        }

        await UrlModel.hardDelete(urlEntry.id);

        res.status(200).json({ message: 'URL deleted successfully' });
    } catch (error) {
        next(error);
    }
};

const deactivateUrl = async (req, res, next) => {
    try {
        const { shortCode } = req.params;
        const userId = req.user ? req.user.id : null;
        const sessionId = !userId ? req.headers['x-session-id'] : null;
        const urlEntry = await UrlModel.findByShortCode(shortCode);

        if (!urlEntry) {
            res.status(404);
            throw new Error('URL not found');
        }

        const isOwner = (userId && urlEntry.user_id === userId) || (!userId && urlEntry.user_id === null && urlEntry.session_id === sessionId);
        if (!isOwner) {
            res.status(403);
            throw new Error('Unauthorized');
        }

        await UrlModel.deactivate(urlEntry.id);

        res.status(200).json({ message: 'URL deactivated successfully' });
    } catch (error) {
        next(error);
    }
};

const activateUrl = async (req, res, next) => {
    try {
        const { shortCode } = req.params;
        const userId = req.user ? req.user.id : null;
        const sessionId = !userId ? req.headers['x-session-id'] : null;
        const urlEntry = await UrlModel.findByShortCode(shortCode);

        if (!urlEntry) {
            res.status(404);
            throw new Error('URL not found');
        }

        const isOwner = (userId && urlEntry.user_id === userId) || (!userId && urlEntry.user_id === null && urlEntry.session_id === sessionId);
        if (!isOwner) {
            res.status(403);
            throw new Error('Unauthorized');
        }

        await UrlModel.activate(urlEntry.id);

        res.status(200).json({ message: 'URL activated successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    shortenUrl,
    redirectUrl,
    getStats,
    getAllUrls,
    deleteUrl,
    deactivateUrl,
    activateUrl
};
