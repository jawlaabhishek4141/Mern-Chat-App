const mongoose = require('mongoose');
const config = require('./env');

/**
 * Connects to MongoDB. Retries a few times with a short backoff before
 * giving up - useful when Mongo (e.g. in Docker Compose) takes a moment
 * longer to become ready than the Node process.
 */
async function connectDB({ retries = 5, delayMs = 2000 } = {}) {
  mongoose.set('strictQuery', true);

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await mongoose.connect(config.mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      // eslint-disable-next-line no-console
      console.log(`[db] Connected to MongoDB (${mongoose.connection.name})`);
      return;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(
        `[db] Connection attempt ${attempt}/${retries} failed: ${err.message}`
      );
      if (attempt === retries) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

mongoose.connection.on('disconnected', () => {
  // eslint-disable-next-line no-console
  console.warn('[db] MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('[db] MongoDB connection error:', err.message);
});

module.exports = connectDB;
