const IlormError = require('./IlormError');

/**
 * Error thrown when the feature is not supported (by the connector or a plugin).
 */
class UnsupportedFeatureError extends IlormError {}

module.exports = UnsupportedFeatureError;
