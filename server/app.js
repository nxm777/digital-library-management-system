require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const app = express();
const cors = require('cors');

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/reading-lists', require('./routes/readingListRoutes'));
app.use("/api/reading-sessions", require('./routes/readingSessionRoutes'));
app.use('/api/statistics', require('./routes/statisticsRoutes'));
app.use("/api/reviews", require('./routes/reviewRoutes.js'));
app.use('/api/challenges', require('./routes/challengeRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

module.exports = app;