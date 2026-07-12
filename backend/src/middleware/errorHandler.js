const config = require('../config/env');

/** 404 fallback for unmatched routes. */
function notFound(req, res, next) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

/* eslint-disable no-unused-vars */
/** Central error handler - keeps error shape consistent across the API. */
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;

  // Translate common Mongoose errors into friendlier messages/status codes.
  let message = err.message || 'Internal server error';
  let resolvedStatus = status;

  if (err.name === 'ValidationError') {
    resolvedStatus = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  } else if (err.code === 11000) {
    resolvedStatus = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `That ${field} is already taken`;
  } else if (err.name === 'CastError') {
    resolvedStatus = 400;
    message = `Invalid ${err.path}`;
  }

  if (config.nodeEnv !== 'test') {
    // eslint-disable-next-line no-console
    console.error('[API Error]', err);
  }

  res.status(resolvedStatus).json({ error: message });
}
/* eslint-enable no-unused-vars */

module.exports = { notFound, errorHandler };
