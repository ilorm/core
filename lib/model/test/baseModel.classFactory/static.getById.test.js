/* eslint-disable */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const { expect } = chai;

const baseModelClassFactory = require('../../baseModel.classFactory');
const MainStream = require('../../main.stream');
const { IS_NEW, } = require('../../../constants').MODEL;

const fakeIlorm = {
  modelsIndex: new Map(),
};

describe('ilorm', () => {
  describe('model', () => {
    describe('baseModel.classFactory', () => {
      describe('Static - getById', () => {
        it('Stream method should return a stream instance binded with the model', () => {
          const BaseModel = baseModelClassFactory(fakeIlorm);

          // This function require to have a model name to work with :
          class Model extends BaseModel {
            constructor(instance) {
              super();

              for (const prop of Object.keys(instance)) {
                this[prop] = instance[prop];
              }
            }

            static getName() {
              return 'modelName';
            }

            static getConnector() {
              return {
                getById: id => Promise.resolve({ id }),
              };
            }
          }

          // Declare the model in the hashmap (required to instantiate it) :
          fakeIlorm.modelsIndex.set('modelName', Model);

          expect(Model.getById(33)).to.eventually.be.deep.equal({
            id: 33,
          });

        });
      });
    });
  });
});
