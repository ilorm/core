const IlormError = require('./IlormError');

/**
 * Error thrown when using Query builder badly
 */
class QueryError extends IlormError {}

module.exports = QueryError;
