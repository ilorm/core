/* eslint-disable */

const assert = require('assert');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { spy } = require('sinon');


chai.use(chaiAsPromised);

const { expect } = chai;

const baseModelClassFactory = require('../../baseModel.classFactory');
const { IS_NEW, } = require('../../../constants').MODEL;

const fakeConnector = {
  create: spy(),
  updateOne: spy(),
};

const fakePrimaryQuery = {
  property: {
    set: () => {},
  },
};

class FakeModel extends baseModelClassFactory({}) {
  static getConnector() {
    return fakeConnector;
  }
  static getSchema() {
    return {
      definition: {
        property: {
          castValue: value => value,
        },
      },
    };
  }
  getQueryPrimary() {
    return fakePrimaryQuery;
  }
}

describe('ilorm', () => {
  describe('model', () => {
    describe('baseModel.classFactory', () => {
      describe('Method - save', () => {

        it('save should create the object if the instance is new', async () => {
          fakeConnector.create.resetHistory();
          fakeConnector.updateOne.resetHistory();

          const instance = new FakeModel();
          instance.property = 'new value';

          await instance.save();

          expect(instance[IS_NEW]).to.be.equal(false);
          expect(fakeConnector.updateOne.notCalled).to.be.equal(true);
          assert(fakeConnector.create.calledWith(instance));
        });

        it('save should update the object if the instance is not new and a field is updated', async () => {
          fakeConnector.create.resetHistory();
          fakeConnector.updateOne.resetHistory();

          const instance = new FakeModel();
          instance[IS_NEW] = false; // Convert the instance to an not new instance
          instance.property = 'new value';

          await instance.save();

          expect(fakeConnector.create.notCalled).to.be.equal(true);
          assert(fakeConnector.updateOne.calledWith(fakePrimaryQuery));
        });

        it('save should do nothing if the object was not new and nothing was updated', async () => {
          fakeConnector.create.resetHistory();
          fakeConnector.updateOne.resetHistory();

          const instance = new FakeModel();
          instance[IS_NEW] = false; // Convert the instance to an not new instance

          await instance.save();

          expect(fakeConnector.create.notCalled).to.be.equal(true);
          expect(fakeConnector.updateOne.notCalled).to.be.equal(true);
        });
      });
    });
  });
});
