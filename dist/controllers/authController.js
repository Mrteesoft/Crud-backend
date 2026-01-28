"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const userModel_1 = require("../models/userModel");
const token_1 = require("../utils/token");
const logger_1 = require("../utils/logger");
const log = (0, logger_1.getLogger)('AuthController');
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existing = await userModel_1.User.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: 'User already registered' });
        }
        const user = await userModel_1.User.create({ name, email, password, role: role });
        log.info('Registered new user', { email, role: user.role });
        const token = (0, token_1.generateToken)(user.id, user.role);
        res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
    }
    catch (err) {
        log.error('Register failed', { error: err.message });
        res.status(500).json({ message: 'Unable to register' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel_1.User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isValid = await user.comparePassword(password);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = (0, token_1.generateToken)(user.id, user.role);
        res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
    }
    catch (err) {
        log.error('Login failed', { error: err.message });
        res.status(500).json({ message: 'Unable to login' });
    }
};
exports.login = login;
//# sourceMappingURL=authController.js.map