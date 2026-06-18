import pb from '@/lib/pocketbaseClient.js';

/**
 * Validates if the current PocketBase auth token is valid and belongs to an admin user.
 * @returns {boolean} true if valid, false otherwise.
 */
export const validateAdminToken = () => {
  const token = pb.authStore.token;
  const isValid = pb.authStore.isValid;
  const model = pb.authStore.model;

  // Token must exist and not be empty
  if (!token || token.trim() === '') {
    return false;
  }

  // PocketBase validity check
  if (!isValid) {
    return false;
  }

  // Must be an admin user model
  if (!model || model.collectionName !== 'admin_users') {
    return false;
  }

  return true;
};