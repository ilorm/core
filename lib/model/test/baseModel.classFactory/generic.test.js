/* eslint-disable */

const assert = require('assert');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { spy, stub } = require('sinon');


chai.use(chaiAsPromised);

const { expect } = chai;

const baseModelClassFactory = require('../../baseModel.classFactory');
const { IS_NEW, } = require('ilorm-constants').MODEL;

const fakeIlorm = {
  modelsIndex: new Map(),
};

describe('ilorm', () => {
  describe('model', () => {
    describe('baseModel.classFactory', () => {
      describe('Generic behavior', () => {
        it('If instantiate a model from the raw constructor, need to be flagged as IS_NEW=true', () => {
          const BaseModel = baseModelClassFactory(fakeIlorm);

          const instance = new BaseModel();

          expect(instance[IS_NEW]).to.be.equal(true);
        });

        it('Methods relative to top level Model should throw an error (Connector, schema, name, plugins...)', () => {
          const BaseModel = baseModelClassFactory(fakeIlorm);
          const modelInstance = new BaseModel();

          expect(BaseModel.getConnector).to.throw('Missing connector binding with the Model');
          expect(BaseModel.getSchema).to.throw('Missing Schema binding with the Model');
          expect(BaseModel.getName).to.throw('Missing Name binding with the Model');
          expect(BaseModel.getPluginsOptions).to.throw('Missing plugins options binding with the Model');
          expect(modelInstance.getQueryPrimary).to.throw('Missing overload by the connector model');
          expect(modelInstance.getPrimary).to.throw('Missing overload by the connector model');
        });

        it('Methods using linked methods relative to top Model should throw an error (Connector, schema, name...)', () => {
          const BaseModel = baseModelClassFactory(fakeIlorm);
          const modelInstance = new BaseModel();


          expect(BaseModel.getById()).to.be.rejectedWith('Missing connector binding with the Model');

          expect(modelInstance.getJson.bind(modelInstance)).to.throw('Missing Schema binding with the Model');
          expect(modelInstance.save()).to.be.rejectedWith('Missing connector binding with the Model');
        });

        it('getJson should call initInstance with the schema binded with the model', () => {
          const BaseModel = baseModelClassFactory(fakeIlorm);

          const initInstance = stub()
            .returns({
              fakeAttribute: 'fakeValue',
            });

          // Create a fakeModel with a fake schema binded:
          class FakeModel extends BaseModel {
            static getSchema() {
              return {
                initInstance,
              }
            }
          }

          const instance = new FakeModel();

          expect(instance.getJson()).to.be.deep.equal({
            fakeAttribute: 'fakeValue',
          });

          assert(initInstance.calledWith(instance));
        });

        it('Should instantiate a model with data', () => {
          const BaseModel = baseModelClassFactory(fakeIlorm);

          const instance = new BaseModel({
            property: 'value',
          });

          expect(instance).to.be.instanceOf(BaseModel);
          expect(instance.property).to.be.equal('value');
        });
      });
    });
  });
});
