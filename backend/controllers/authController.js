const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development_only';

const register = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            res.status(400);
            throw new Error('Please provide username and password');
        }

        const existingUser = await UserModel.findByUsername(username);
        if (existingUser) {
            res.status(400);
            throw new Error('Username already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const userId = await UserModel.create(username, passwordHash);

        const token = jwt.sign({ id: userId, username }, JWT_SECRET, {
            expiresIn: '7d'
        });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: userId, username }
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400);
            throw new Error('Please provide username and password');
        }

        const user = await UserModel.findByUsername(username);
        if (!user) {
            res.status(401);
            throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            res.status(401);
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
            expiresIn: '7d'
        });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user.id, username: user.username }
        });
    } catch (error) {
        next(error);
    }
};

const getMe = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.user.id);
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getMe
};
