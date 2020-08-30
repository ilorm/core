const chai = require('chai');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
const sinon = require('sinon');
const { expect, } = chai;

const { SORT_BEHAVIOR, } = require('../lib/constants').QUERY;

// Create a clean instance of ilorm :
const Ilorm = require('..').constructor;
const ilorm = new Ilorm();
const { Schema, newModel, } = ilorm;

const connector = {
  queryFactory: ({ ParentQuery, }) => ParentQuery,
  modelFactory: ({ ParentModel, }) => ParentModel,
};

const SCHEMA = {
  firstName: Schema.string(),
  lastName: Schema.string(),
  age: Schema.number(),
};

const schema = new Schema(SCHEMA);

const userModel = newModel({
  schema,
  connector,
});


describe('spec ilorm', () => {
  describe('Query', () => {
    it('Could use sort operator to trigger sorting ascending per a specific field', async () => {
      const onSort = sinon.spy();

      connector.findOne = query => {
        query.queryBuilder({ onSort, });
      };

      await userModel.query()
        .lastName.useAsSortAsc()
        .findOne();

      expect(onSort).to.have.been.calledWith({ behavior: SORT_BEHAVIOR.ASCENDING,
        field: SCHEMA.lastName,
        ancestorFields: null, });
    });

    it('Could use sort operator to trigger sorting descending per a specific field', async () => {
      const onSort = sinon.spy();

      connector.findOne = query => {
        query.queryBuilder({ onSort, });
      };

      await userModel.query()
        .lastName.useAsSortDesc()
        .findOne();

      expect(onSort).to.have.been.calledWith({ behavior: SORT_BEHAVIOR.DESCENDING,
        field: SCHEMA.lastName,
        ancestorFields: null, });
    });
  });
});
