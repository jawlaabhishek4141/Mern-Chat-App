/**
 * Standard application error carrying an HTTP status code, so the central
 * error handler can respond consistently without each controller
 * hand-rolling response shapes.
 */
class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
