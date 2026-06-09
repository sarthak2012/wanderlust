class ExpressError extends Error {
  constructor(statusCode, message) {
    super(message); // pass message to parent Error class
    this.statusCode = statusCode; // must be a number (e.g., 404)
  }
}

module.exports = ExpressError;