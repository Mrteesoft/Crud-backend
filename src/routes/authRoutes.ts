import { Router } from 'express';
import { login, register } from '../controllers/authController';
import { validateRequest } from '../middlewares/validateRequest';
import { loginSchema, registerSchema } from '../validators/authValidators';
import { me } from '../controllers/meController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

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
router.post('/register', validateRequest(registerSchema), register);

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
router.post('/login', validateRequest(loginSchema), login);

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
router.get('/me', authMiddleware, me);

export default router;