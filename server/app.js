const express = require('express');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/reading-lists', require('./routes/readingListRoutes'));
app.use("/api/reading-sessions", require('./routes/readingSessionRoutes'));

module.exports = app;