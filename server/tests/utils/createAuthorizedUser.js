const request = require('supertest');
const User = require('../../models/User');
const app = require('../../app');
const jwt = require('jsonwebtoken');

async function createAdminAndGetToken() {

    const adminData = {
        firstName: "admin",
        lastName: "admin",
        username: 'admin_test',
        email: 'admin_test@example.com',
        password: 'StrongPass123!',
        role: 'admin'
    };

    const admin = new User(adminData);
    await admin.save();

    const token = jwt.sign(
        { id: admin._id, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    if (!token) {
        throw new Error('Token was not returned. Check login endpoint response.');
    }

    return token;
}

module.exports = { createAdminAndGetToken };