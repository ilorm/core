const { AsyncLocalStorage, } = require('async_hooks');

const transactionLocalStorage = AsyncLocalStorage ? new AsyncLocalStorage() : null;

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
  static async run(handler) {
    const transaction = new this();

    if (!transactionLocalStorage) {
      try {
        const value = await handler({ transaction, });

        await transaction.commit();

        return value;
      } catch (err) {
        await transaction.rollback();

        throw err;
      }
    }

    return transactionLocalStorage.run(transaction, async () => {
      try {
        const value = await handler({ transaction, });

        await transaction.commit();

        return value;
      } catch (err) {
        await transaction.rollback();

        throw err;
      }
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
