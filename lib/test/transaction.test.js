const { expect, } = require('chai');

const Transaction = require('../transaction.class');

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
  });
});

