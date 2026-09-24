const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/authRoutes');
const errorHandler = require('../middleware/errorHandler');
const pool = require('../config/db');

// Setup a small express app for testing auth routes
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(errorHandler);

describe('Authentication API', () => {
    // Generate a random username for testing to avoid conflicts
    const testUser = {
        username: `testuser_${Date.now()}`,
        password: 'password123'
    };

    afterAll(async () => {
        // Clean up test user
        await pool.query('DELETE FROM users WHERE username = ?', [testUser.username]);
        await pool.end();
    });

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('username', testUser.username);
    });

    it('should not register duplicate username', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Username already exists');
    });

    it('should login an existing user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send(testUser);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('username', testUser.username);
    });

    it('should fail login with wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ username: testUser.username, password: 'wrongpassword' });

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });
});
