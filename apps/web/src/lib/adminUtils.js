import pb from '@/lib/pocketbaseClient.js';

/**
 * Check if the user is an admin
 * @param {Object} user - The PocketBase user model
 * @returns {boolean} True if user is admin
 */
export const isAdmin = (user) => {
  return user && user.collectionName === 'admin_users';
};

/**
 * Check if admin has permission to manage artisans
 * @param {Object} user - The admin user model
 * @returns {boolean} True if permitted
 */
export const canManageArtisans = (user) => {
  if (!isAdmin(user)) return false;
  // If specific roles are implemented later, check them here. 
  // Currently, all admins have access.
  return true;
};

/**
 * Check if admin has permission to moderate reviews
 * @param {Object} user - The admin user model
 * @returns {boolean} True if permitted
 */
export const canModerateReviews = (user) => {
  if (!isAdmin(user)) return false;
  return true;
};

/**
 * Check if admin has permission to manage missions
 * @param {Object} user - The admin user model
 * @returns {boolean} True if permitted
 */
export const canManageMissions = (user) => {
  if (!isAdmin(user)) return false;
  return true;
};

/**
 * Get all permissions flags for an admin
 * @param {Object} user - The admin user model
 * @returns {Object} Dictionary of permissions
 */
export const getAdminPermissions = (user) => {
  return {
    manageArtisans: canManageArtisans(user),
    moderateReviews: canModerateReviews(user),
    manageMissions: canManageMissions(user),
    isSuperAdmin: user?.role === 'admin'
  };
};