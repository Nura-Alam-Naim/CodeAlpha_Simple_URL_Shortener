const pool = require('../config/db');

const UrlModel = {
    async findByOriginalUrl(originalUrl) {
        const [rows] = await pool.query(
            'SELECT * FROM urls WHERE original_url = ? AND is_active = TRUE AND (expires_at IS NULL OR expires_at > NOW())',
            [originalUrl]
        );
        return rows[0];
    },

    async findByShortCode(shortCode) {
        const [rows] = await pool.query(
            'SELECT * FROM urls WHERE short_code = ?',
            [shortCode]
        );
        return rows[0];
    },

    async create(shortCode, originalUrl, expiresAt) {
        const [result] = await pool.query(
            'INSERT INTO urls (short_code, original_url, expires_at) VALUES (?, ?, ?)',
            [shortCode, originalUrl, expiresAt]
        );
        return result.insertId;
    },

    async incrementClickCount(id) {
        await pool.query(
            'UPDATE urls SET click_count = click_count + 1 WHERE id = ?',
            [id]
        );
    },

    async deactivate(id) {
        await pool.query(
            'UPDATE urls SET is_active = FALSE WHERE id = ?',
            [id]
        );
    },

    async logClick(urlId, ipAddress, userAgent) {
        await pool.query(
            'INSERT INTO click_logs (url_id, ip_address, user_agent) VALUES (?, ?, ?)',
            [urlId, ipAddress, userAgent]
        );
    },

    async getStats(shortCode) {
        const [urlRows] = await pool.query(
            'SELECT * FROM urls WHERE short_code = ?',
            [shortCode]
        );
        const url = urlRows[0];
        if (!url) return null;

        const [logRows] = await pool.query(
            'SELECT clicked_at, ip_address, user_agent FROM click_logs WHERE url_id = ? ORDER BY clicked_at DESC LIMIT 10',
            [url.id]
        );

        return { ...url, recent_logs: logRows };
    },

    async getAll(limit, offset, search) {
        let query = 'SELECT id, short_code, original_url, click_count, created_at, expires_at, is_active FROM urls';
        let params = [];
        let countQuery = 'SELECT COUNT(*) as total FROM urls';

        if (search) {
            query += ' WHERE original_url LIKE ? OR short_code LIKE ?';
            countQuery += ' WHERE original_url LIKE ? OR short_code LIKE ?';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm);
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        
        // Convert to numbers explicitly as mysql2 sometimes trips on strings for LIMIT
        params.push(Number(limit), Number(offset));

        const [rows] = await pool.query(query, params);
        
        // Use a separate param array for countQuery as it doesn't need LIMIT/OFFSET
        const countParams = search ? [`%${search}%`, `%${search}%`] : [];
        const [countRows] = await pool.query(countQuery, countParams);

        return {
            urls: rows,
            total: countRows[0].total
        };
    }
};

module.exports = UrlModel;
