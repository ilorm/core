/**
 * Class representing an error throw by the ORM itself
 */
class IlormError extends Error {
  /**
   * Create an error
   * @param {String} message The message associate with the error
   * @param {Error} parentError The error thrown before (if exists)
   */
  constructor(message, parentError = null) {
    super(message);
    this.parent = parentError;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = IlormError;

