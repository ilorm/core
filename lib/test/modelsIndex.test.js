const { expect, } = require('chai');
const util = require('util');
const gbIlorm = require('..');


// eslint-disable-next-line require-jsdoc
function createFakeMockModel(modelName) {
  return class {
    // eslint-disable-next-line require-jsdoc
    static getName() {
      return modelName;
    }
  };
}

// eslint-disable-next-line require-jsdoc
function checkIsPromisePending(promise) {
  return util.inspect(promise).includes('pending');
}

describe('unit test - ilorm', () => {
  describe('ModelsIndex - ilorm.getModelByName', () => {
    let ilorm;

    // Reset ilorm between every test;
    beforeEach(() => {
      ilorm = new gbIlorm.constructor();
    });

    it('Should load model when available', async () => {
      const modelPromise = ilorm.getModelByName('myModel');

      // eslint-disable-next-line no-unused-expressions
      expect(checkIsPromisePending(modelPromise)).to.be.true;

      ilorm.declareModel(createFakeMockModel('anotherModel'));


      // eslint-disable-next-line no-unused-expressions
      expect(checkIsPromisePending(modelPromise)).to.be.true;

      ilorm.declareModel(createFakeMockModel('myModel'));

      // eslint-disable-next-line no-unused-expressions
      expect(checkIsPromisePending(modelPromise)).to.be.false;
      expect((await modelPromise).getName()).to.be.equal('myModel');
    });
  });
});
