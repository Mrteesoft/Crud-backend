"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validateRequest_1 = require("../middlewares/validateRequest");
const auth_validators_1 = require("../validators/auth.validators");
const me_controller_1 = require("../controllers/me.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register or re-register a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *           example:
 *             name: Jane Doe
 *             email: jane@example.com
 *             password: secret123
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       200:
 *         description: User re-registered (email existed)
 *       500:
 *         description: Unable to register
 */
router.post('/register', (0, validateRequest_1.validateRequest)(auth_validators_1.registerSchema), auth_controller_1.register);
/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *           example:
 *             email: jane@example.com
 *             password: secret123
 *     responses:
 *       200:
 *         description: Authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', (0, validateRequest_1.validateRequest)(auth_validators_1.loginSchema), auth_controller_1.login);
/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user
 *       401:
 *         description: Unauthorized
 */
router.get('/me', auth_1.authMiddleware, me_controller_1.me);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map