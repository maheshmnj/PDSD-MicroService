// authRouter.ts
import express from 'express';
import authController from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const authRouter = express.Router();

// POST /auth/signup
authRouter.post('/signup', authController.signup);

// POST /auth/login
authRouter.post('/login', authController.login);

// Example of a protected route
// GET /auth/protected
authRouter.get('/protected', authMiddleware, (req, res) => {
    // This route is protected by the authMiddleware
    res.json({ message: 'This is a protected route' });
});

authRouter.post('/verify-token', authMiddleware, (req, res) => {
    // This route can be used by other microservices to verify the token
    res.json({ message: 'Token is valid' });
});

export default authRouter;
