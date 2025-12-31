/**
 * * @param {Object} resource
 * @param {string|Object} userId
 * @returns {boolean}
 */
exports.isOwner = (resource, userId) => {
  if (!resource || !userId) return false;

  const owner = resource.ownerId || resource.userId;

  if (!owner) {
    console.error('Resource has no ownerId or userId field');
    return false;
  }

  const ownerId = owner._id ? owner._id : owner;

  return ownerId.toString() === userId.toString();
};