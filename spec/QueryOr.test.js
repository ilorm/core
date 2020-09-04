const chai = require('chai');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
const sinon = require('sinon');
const { expect, } = chai;

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
    it('Should use or operator to build query', async () => {
      const onOperator = sinon.spy();
      const onOperatorBranchA = sinon.spy();
      const onOperatorBranchB = sinon.spy();

      // eslint-disable-next-line require-jsdoc
      const onOr = ([ branchA, branchB, ]) => {
        branchA.queryBuilder({ onOperator: onOperatorBranchA, });
        branchB.queryBuilder({ onOperator: onOperatorBranchB, });
      };

      connector.findOne = (query) => {
        query.queryBuilder({ onOperator,
          onOr, });
      };

      await userModel.query()
        .or((branch) => {
          branch().firstName.is('Guillaume');
          branch().firstName.is('Tom');
        })
        .lastName.is('Daix')
        .findOne();

      expect(onOperatorBranchA).to.have.been.calledWith({ field: SCHEMA.firstName,
        operator: 'is',
        value: 'Guillaume',
        ancestorFields: null,
      });
      expect(onOperatorBranchB).to.have.been.calledWith({ field: SCHEMA.firstName,
        operator: 'is',
        value: 'Tom',
        ancestorFields: null, });
      expect(onOperator).to.have.been.calledWith({ field: SCHEMA.lastName,
        operator: 'is',
        value: 'Daix',
        ancestorFields: null, });
    });
    it('Should handle multiple or at the same query level', async () => {
      const onOperatorBranchA = sinon.spy();
      const onOperatorBranchB = sinon.spy();

      // eslint-disable-next-line require-jsdoc
      const onOr = ([ branchA, branchB, ]) => {
        branchA.queryBuilder({ onOperator: onOperatorBranchA, });
        branchB.queryBuilder({ onOperator: onOperatorBranchB, });
      };

      connector.findOne = (query) => {
        query.queryBuilder({ onOr, });
      };

      await userModel.query()
        .or((branch) => {
          branch().firstName.is('Guillaume');
          branch().firstName.is('Tom');
        })
        .or((branch) => {
          branch().lastName.is('Daix');
          branch().lastName.is('Smith');
        })
        .findOne();

      expect(onOperatorBranchA).to.have.been.calledWith({ field: SCHEMA.firstName,
        operator: 'is',
        value: 'Guillaume',
        ancestorFields: null, });
      expect(onOperatorBranchA).to.have.been.calledWith({ field: SCHEMA.lastName,
        operator: 'is',
        value: 'Daix',
        ancestorFields: null, });
      expect(onOperatorBranchB).to.have.been.calledWith({ field: SCHEMA.firstName,
        operator: 'is',
        value: 'Tom',
        ancestorFields: null, });
      expect(onOperatorBranchB).to.have.been.calledWith({ field: SCHEMA.lastName,
        operator: 'is',
        value: 'Smith',
        ancestorFields: null, });

    });
  });
});
