const chai = require('chai');
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const sinon = require('sinon');
const { expect } = chai;

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
  createdAt: Schema.date(),
});

const userModel = newModel({
  schema,
  connector,
});


describe('spec ilorm', () => {
  describe('Query', () => {
    it('Should filter with all field of the schema', async () => {
      const onOperator = sinon.spy();
      connector.findOne = query => {
        query.queryBuilder({ onOperator, });
      };

      const dateQuery = new Date('2018-12-01');

      await userModel.query()
        .firstName.is('Guillaume')
        .lastName.isNot('Daix')
        .age.between([25, 35])
        .createdAt.greaterThan(dateQuery)
        .findOne();

      expect(onOperator).to.have.been.calledWith({ field: 'firstName', operator: 'is', value: 'Guillaume' });
      expect(onOperator).to.have.been.calledWith({ field: 'lastName', operator: 'isNot', value: 'Daix' });
      expect(onOperator).to.have.been.calledWith({ field: 'age', operator: 'between', value: [25, 35] });
      expect(onOperator).to.have.been.calledWith({ field: 'createdAt', operator: 'greaterThan', value: dateQuery });
    });
  });
});