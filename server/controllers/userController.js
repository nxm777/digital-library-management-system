const User = require('../models/User');
const validator = require('validator');

exports.getAllUsers = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10, role } = req.query;

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.max(parseInt(limit, 10) || 10, 1);

    const searchRegex = search ? new RegExp(search, 'i') : null;

    const query = {};
    if (role) {
      query.role = role;
    }
    if (searchRegex) {
      query.$or = [
        { username: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
        { firstName: { $regex: searchRegex } },
        { lastName: { $regex: searchRegex } },
      ];
    }

    const totalCount = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .select('-password');

    const totalPages = Math.max(Math.ceil(totalCount / limitNumber), 1);

    return res.status(200).json({
      success: true,
      count: totalCount,
      totalPages,
      currentPage: pageNumber,
      data: users,
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    return res.status(500).json({ success: false, message: 'Server error while fetching users' });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role value' });
    }

    if (req.user?.id === userId && role === 'user') {
      return res.status(403).json({ success: false, message: 'You cannot remove your own admin role' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Role updated',
      data: user,
    });
  } catch (err) {
    console.error('Error updating user role:', err);
    return res.status(500).json({ success: false, message: 'Server error while updating user role' });
  }
};

exports.updateOwnEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const userId = req.user.id;

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email' });
    }

    const emailTaken = await User.findOne({ email: email.toLowerCase(), _id: { $ne: userId } });
    if (emailTaken) {
      return res.status(409).json({ success: false, message: 'Email is already in use' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.email = email.toLowerCase();
    await user.save();

    return res.status(200).json({ success: true, message: 'Email updated', data: user });
  } catch (err) {
    console.error('Error updating email:', err);
    return res.status(500).json({ success: false, message: 'Server error while updating email' });
  }
};

exports.updateOwnPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ success: true, message: 'Password updated' });
  } catch (err) {
    console.error('Error updating password:', err);
    return res.status(500).json({ success: false, message: 'Server error while updating password' });
  }
};