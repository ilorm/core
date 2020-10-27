const { expect, } = require('chai');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const Transaction = require('../transaction.class');
const TransactionWithoutLocalStorage = proxyquire('../transaction.class', {
  // eslint-disable-next-line camelcase
  async_hooks: {
    AsyncLocalStorage: null,
  },
});

/**
 * Overload Transaction with spy to avoid fatal crash on call for commit, bindModel and rollback
 * @param {Transaction} Transaction to overload
 * @returns {TestTransaction} to use in test
 */
function overloadTransaction(Transaction) {
  const TestTransaction = class TestTransaction extends Transaction {
    // eslint-disable-next-line require-jsdoc
    commit() {
      this.constructor.commitSpy();
    }
    // eslint-disable-next-line require-jsdoc
    rollback() {
      this.constructor.rollbackSpy();
    }
    // eslint-disable-next-line require-jsdoc
    bindModel() {
      this.constructor.bindModelSpy();
    }
  };

  TestTransaction.commitSpy = sinon.spy();
  TestTransaction.rollbackSpy = sinon.spy();
  TestTransaction.bindModelSpy = sinon.spy();

  return TestTransaction;
}

const UnsupportedFeatureError = require('../errors/UnsupportedFeatureError');


describe('unit test - ilorm', () => {
  describe('Transaction', () => {
    it('Transaction.commit should throw an error if non overwritten', () => {
      const transaction = new Transaction();

      expect(transaction.commit).to.throw(UnsupportedFeatureError);
    });
    it('Transaction.commit should throw an error if non overwritten', () => {
      const transaction = new Transaction();

      expect(transaction.rollback).to.throw(UnsupportedFeatureError);
    });
    it('Transaction.commit should throw an error if non overwritten', () => {
      const transaction = new Transaction();

      // eslint-disable-next-line require-jsdoc
      const bindModel = () => transaction.bindModel({
        Model: {
          getName: () => 'test',
        },
      });

      expect(bindModel).to.throw(UnsupportedFeatureError);
    });

    // TODO: The four following test need probably to be improved; maximize test coverage but seems flaky
    describe('Transaction with async local storage', () => {
      it('Should commit transaction, if no operation fail', async () => {
        const TestTransaction = overloadTransaction(Transaction);

        await TestTransaction.run(() => {});

        sinon.assert.notCalled(TestTransaction.rollbackSpy);
        sinon.assert.calledOnce(TestTransaction.commitSpy);
      });
      it('Should rollback transaction, if exception is throw', async () => {
        const TestTransaction = overloadTransaction(Transaction);

        try {
          await TestTransaction.run(() => {
            throw new Error('Fail Transaction');
          });
        } catch (err) {
          // Do nothing for test purpose
        }

        sinon.assert.calledOnce(TestTransaction.rollbackSpy);
        sinon.assert.notCalled(TestTransaction.commitSpy);
      });
    });

    describe('Transaction without async local storage', () => {
      it('Should commit transaction, if no operation fail', async () => {
        const TestTransaction = overloadTransaction(TransactionWithoutLocalStorage);

        await TestTransaction.run(() => {});

        sinon.assert.notCalled(TestTransaction.rollbackSpy);
        sinon.assert.calledOnce(TestTransaction.commitSpy);
      });
      it('Should rollback transaction, if exception is throw', async () => {
        const TestTransaction = overloadTransaction(TransactionWithoutLocalStorage);

        try {
          await TestTransaction.run(() => {
            throw new Error('Fail Transaction');
          });
        } catch (err) {
          // Do nothing for test purpose
        }

        sinon.assert.calledOnce(TestTransaction.rollbackSpy);
        sinon.assert.notCalled(TestTransaction.commitSpy);
      });
    });
  });
});

