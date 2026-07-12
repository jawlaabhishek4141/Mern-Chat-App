const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const config = require('./config/env');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: config.clientOrigins, credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(mongoSanitize()); // strips $ / . operators from user input - prevents NoSQL injection
  app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
  app.use('/api', apiLimiter);

  app.get('/', (req, res) => {
    res.json({ name: 'mern-chat-backend', status: 'running', env: config.nodeEnv });
  });

  app.use('/api', routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
