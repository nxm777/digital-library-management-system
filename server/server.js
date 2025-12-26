require('dotenv').config();

const app = require('./app');
const connectDatabase = require('./database/connect');

const PORT = process.env.PORT;

(async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();