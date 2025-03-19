import express from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  getCurrentUser,
  revokeUserTokens,
  forgotPassword,
  resetPassword,
  verifyEmail
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Creates a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [CLIENT, ADMIN, STAFF, OBSERVER]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input data
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User login
 *     description: Authenticates a user and returns tokens as HttpOnly cookies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Authentication failed
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User logout
 *     description: Logs out the user and clears auth cookies
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', logout);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Refresh access token
 *     description: Uses refresh token to issue a new access token
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post('/refresh', refreshToken);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get current user info
 *     description: Returns information about the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *       401:
 *         description: Not authenticated
 */
router.get('/me', authenticate, getCurrentUser);

/**
 * @swagger
 * /api/auth/revoke:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Revoke tokens
 *     description: Revokes specified tokens or all tokens for the current user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tokenIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               all:
 *                 type: boolean
 *               exceptCurrent:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Tokens revoked successfully
 *       401:
 *         description: Not authenticated
 */
router.post('/revoke', authenticate, revokeUserTokens);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Forgot password
 *     description: Initiates password reset process
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset initiated
 */
router.post('/forgot-password', forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Reset password
 *     description: Completes password reset with token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid token or password
 */
router.post('/reset-password', resetPassword);

/**
 * @swagger
 * /api/auth/verify-email:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Verify email
 *     description: Verifies user email with token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid token
 */
router.post('/verify-email', verifyEmail);

export default router;
