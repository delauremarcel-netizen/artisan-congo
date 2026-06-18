import logger from '../utils/logger.js';

/**
 * Middleware factory to check if authenticated user has required role
 * Returns 403 if insufficient permissions
 * Throws Error on failure (caught by errorMiddleware)
 * @param {string|string[]} requiredRoles - Single role or array of allowed roles
 * @returns {Function} Express middleware function
 */
export const verifyRole = (requiredRoles) => {
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

  return (req, res, next) => {
    if (!req.userRole) {
      logger.warn('Role verification failed: User role not found in request');
      throw new Error('User role not found');
    }

    if (!roles.includes(req.userRole)) {
      logger.warn('Role verification failed: Insufficient permissions', {
        userRole: req.userRole,
        requiredRoles: roles,
      });
      return res.status(403).json({
        error: 'Forbidden: Insufficient permissions',
      });
    }

    logger.info('Role verification successful', { userRole: req.userRole, requiredRoles: roles });
    next();
  };
};
