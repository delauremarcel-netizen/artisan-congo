import 'dotenv/config';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

/**
 * Middleware to extract and validate JWT tokens from Authorization headers
 * Extracts userId and role from the token and attaches to req object
 * Throws Error on failure (caught by errorMiddleware)
 */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Token verification failed: Missing or invalid authorization header');
    throw new Error('Missing or invalid authorization header');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id || decoded.userId;
    req.userRole = decoded.role;

    logger.info('Token verified successfully', { userId: req.userId, role: req.userRole });
    next();
  } catch (error) {
    logger.error('Token verification failed:', error.message);
    throw new Error('Invalid or expired token');
  }
};
