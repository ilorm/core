const chai = require('chai');
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const sinon = require('sinon');
const { expect } = chai;

const { SORT_BEHAVIOR, } = require('ilorm-constants').QUERY;

// Create a clean instance of ilorm :
const Ilorm = require('..').constructor;
const ilorm = new Ilorm();
const { Schema, newModel } = ilorm;

const connector = {
  queryFactory: ({ ParentQuery, }) => ParentQuery,
  modelFactory: ({ ParentModel, }) => ParentModel,
};

const schema = new Schema({
  firstName: Schema.string(),
  lastName: Schema.string(),
  age: Schema.number(),
});

const userModel = newModel({
  schema,
  connector,
});


describe('spec ilorm', () => {
  describe('Query', () => {
    it('Could use skip to ignore some fields', async () => {
      const onOptions = sinon.spy();
      connector.find = query => {
        query.queryBuilder({ onOptions, });

        return [];
      };

      await userModel.query()
        .skip(10)
        .find();

      expect(onOptions).to.have.been.calledWith({ limit: undefined, skip: 10 });
    });

    it('Could use limit', async () => {
      const onOptions = sinon.spy();
      connector.find = query => {
        query.queryBuilder({ onOptions, });

        return [];
      };

      await userModel.query()
        .limit(10)
        .find();

      expect(onOptions).to.have.been.calledWith({ limit: 10, skip: undefined });
    });
  });
});