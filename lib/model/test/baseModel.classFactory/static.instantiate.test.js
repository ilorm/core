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
      describe('Static - instantiate', () => {
        it('Instantiate should return an instance of the model not flagged as new', () => {
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

            static getSchema() {
              return {
                definition: {
                  property: {
                    castValue: value => value,
                  },
                },
              };
            }
          }

          // Declare the model in the hashmap (required to instantiate it) :
          fakeIlorm.modelsIndex.set('modelName', Model);

          const instanceA = Model.instantiate();
          const instanceB = Model.instantiate({
            property: 'value',
          });

          expect(instanceA[IS_NEW]).to.be.equal(false);
          expect(instanceA.property).to.be.equal(undefined);
          expect(instanceA).to.be.instanceOf(Model);

          expect(instanceB[IS_NEW]).to.be.equal(false);
          expect(instanceB.property).to.be.equal('value');
          expect(instanceB).to.be.instanceOf(Model);
        });
      });
    });
  });
});
