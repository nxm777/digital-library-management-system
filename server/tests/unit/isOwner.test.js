const { isOwner } = require('../../utils/permissions');
const mongoose = require('mongoose');

describe('isOwner function', () => {
  
  const userId = new mongoose.Types.ObjectId();
  const otherUserId = new mongoose.Types.ObjectId();

  it('should return true if resource.ownerId matches userId', () => {
    const resource = { ownerId: userId };
    expect(isOwner(resource, userId)).toBe(true);
  });

  it('should return true if resource.userId matches userId (alternative field name)', () => {
    const resource = { userId: userId };
    expect(isOwner(resource, userId)).toBe(true);
  });

  it('should return false if ID do not match', () => {
    const resource = { ownerId: userId };
    expect(isOwner(resource, otherUserId)).toBe(false);
  });

  it('should handle populated owner object correctly', () => {
    const resource = {
      ownerId: {
        _id: userId,
        username: 'Kamil',
        email: 'kamil@test.com'
      }
    };
    expect(isOwner(resource, userId)).toBe(true);
    expect(isOwner(resource, userId.toString())).toBe(true);
  });

  it('should return false if inputs are missing', () => {
    expect(isOwner(null, userId)).toBe(false);
    expect(isOwner({}, null)).toBe(false);
    expect(isOwner(undefined, undefined)).toBe(false);
  });

  it('should handle string inputs correctly', () => {
    const strId1 = '123456';
    const strId2 = '123456';
    const resource = { ownerId: strId1 };
    
    expect(isOwner(resource, strId2)).toBe(true);
  });
});