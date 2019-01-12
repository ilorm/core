/* eslint-disable */

const { expect, } = require('chai');

const ModelFactory = require('../model.factory');

const fakeIlorm = {
  BaseModel: class BaseModel {
    static isBaseModel() {
      return true;
    }
  },
  modelsIndex: new Map(),
};

const fakeConnector = {
  modelFactory: ({ ParentModel }) => ParentModel,
};
const fakeSchema = {
  bindWithModel: () => {},
  getProxy: () => ({})
};


describe('ilorm', () => {
  describe('model', () => {
    describe('model.factory', () => {
      it('Should create a model class', () => {

        const Model = ModelFactory({
          connector: fakeConnector,
          ilorm: fakeIlorm,
          schema: fakeSchema,
        });

        expect(Model.isBaseModel()).to.be.equal(true);
        expect(Model.getConnector()).to.be.equal(fakeConnector);
        expect(Model.getName()).to.be.a('symbol');
        expect(Model.getPluginsOptions()).to.be.deep.equal({});
        expect(Model.getSchema()).to.be.equal(fakeSchema);
      });

      it('Should instantiate a empty model', () => {
        const Model = ModelFactory({
          connector: fakeConnector,
          ilorm: fakeIlorm,
          schema: fakeSchema,
        });

        const instance = new Model();

        expect(instance).to.be.instanceOf(Model);
      });
    });
  });
});
