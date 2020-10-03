const IlormError = require('./IlormError');

/**
 * Error thrown when using Model class or instance badly
 */
class ModelError extends IlormError {}

module.exports = ModelError;
