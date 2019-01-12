/* eslint-disable */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const { expect } = chai;

const baseModelClassFactory = require('../../baseModel.classFactory');
const MainStream = require('../../main.stream');

const fakeIlorm = {
  modelsIndex: new Map(),
};

describe('ilorm', () => {
  describe('model', () => {
    describe('baseModel.classFactory', () => {
      describe('Static - stream', () => {
        it('Stream method should return a stream instance binded with the model', () => {
          const BaseModel = baseModelClassFactory(fakeIlorm);

          const stream = BaseModel.stream();

          expect(stream).to.be.instanceOf(MainStream);
          expect(stream.Model).to.be.equal(BaseModel);
        });
      });
    });
  });
});
