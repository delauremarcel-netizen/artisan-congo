import 'dotenv/config';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

/**
 * Admin authentication middleware using JWT
 * Validates Authorization header token and verifies admin user role
 */
export const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Admin auth failed: Missing or invalid authorization header');
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin') {
      logger.warn('Admin auth failed: User is not an admin', { role: decoded.role });
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    logger.error('Token verification failed:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};