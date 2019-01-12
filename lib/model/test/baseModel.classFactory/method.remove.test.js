/* eslint-disable */

const assert = require('assert');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { spy } = require('sinon');


chai.use(chaiAsPromised);

const { expect } = chai;

const baseModelClassFactory = require('../../baseModel.classFactory');
const { IS_NEW, } = require('ilorm-constants').MODEL;


const fakeConnector = {
  removeOne: spy(),
};

class FakeModel extends baseModelClassFactory({}) {
  static getConnector() {
    return fakeConnector;
  }

  getQueryPrimary() {
    return 'FAKE_PRIMARY';
  }
}

describe('ilorm', () => {
  describe('model', () => {
    describe('baseModel.classFactory', () => {
      describe('Method - remove', () => {
        it('should throw an error if the instance is new', () => {
          fakeConnector.removeOne.resetHistory();

          const instance = new FakeModel();

          expect(instance.remove()).to.be.rejectedWith(Error, 'Can not remove an unsaved instance');
        });

        it('remove should delete the object in the database', async () => {
          fakeConnector.removeOne.resetHistory();

          const instance = new FakeModel();
          instance[IS_NEW] = false; // Convert the instance to an not new instance

          await instance.remove();

          assert(fakeConnector.removeOne.calledWith('FAKE_PRIMARY'));
        });
      });
    });
  });
});
