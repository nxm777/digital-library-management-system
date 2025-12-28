const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { 
        id: user._id,
        role: user.role
     }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, username, email, password } = req.body;
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(409).json({ message: "User with that email or username already exists." });
        }

        const user = await User.create({ 
            firstName, 
            lastName, 
            username, 
            email, 
            password });

        const token = generateToken(user);

        res.status(201).json({
            message: "User registered successfully",
            user: user.toJSON(),
            token
        });
    } catch (err) {
  if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => ({ message: e.message }));
      return res.status(400).json({
        message: 'Validation failed',
        errors: messages
      });
    }
  res.status(500).json({ message: 'Server error' });
}
};

const loginUser = async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;
  
        const user = await User.findOne({
            $or: [
                { email: emailOrUsername.toLowerCase() },
                { username: emailOrUsername.toLowerCase() }
            ]
        });
  
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials." });
        }
  
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials." });
        }
  
        const token = generateToken(user);

        res.status(200).json({
            message: "Login successful",
            user: user.toJSON(),
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Login failed. Please try again." });
    }
};

module.exports = {
    registerUser,
    loginUser
};