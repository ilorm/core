const { AsyncLocalStorage, } = require('async_hooks');

const transactionLocalStorage = new AsyncLocalStorage();

/**
 * Represent a transaction
 */
class Transaction {
  /**
   * Commit the transaction, applying the result into the database
   * @returns {Promise} Resolve when is finished
   */
  commit() {
    throw new Error('Connector does not support Transaction');
  }

  /**
   * Rollback the transaction.
   * @returns {Promise} Resolve when is finished
   */
  rollback() {
    throw new Error('Connector does not support Transaction');
  }

  /**
   * Model the transaction run on
   * @param {Model} Model The model
   * @returns {void} Return nothing
   */
  bindModel({ Model, }) {
    throw new Error(
      `Try bind ${Model.getName()} with a Transaction, on a connector which does not support transaction`
    );
  }

  /**
   * Create a safe context for running the transaction
   * @param {Function} handler The handler when the transaction run
   * @returns {Promise} Resolve when the transaction is finished
   */
  static run(handler) {
    const transaction = new this();

    return new Promise((resolve, reject) => {
      transactionLocalStorage.run(transaction, async () => {
        try {
          await handler({ transaction, });
        } catch (err) {
          await transaction.rollback();

          reject(err);
        }

        await transaction.commit();
        resolve();
      });
    });
  }

  /**
   * Return current transaction
   * @returns {Transaction} The current transaction
   */
  static getCurrentTransaction() {
    return transactionLocalStorage.getStore();
  }
}

module.exports = Transaction;
