const IlormError = require('./IlormError');

/**
 * Error thrown when trying to bind an invalid value to a property
 */
class InvalidValueError extends IlormError {}

module.exports = InvalidValueError;
