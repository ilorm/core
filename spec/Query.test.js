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
  createdAt: Schema.date(),
};

const schema = new Schema(SCHEMA);

const userModel = newModel({
  schema,
  connector,
});


describe('spec ilorm', () => {
  describe('Query', () => {
    it('Should filter with all field of the schema', async () => {
      const onOperator = sinon.spy();

      connector.findOne = (query) => {
        query.queryBuilder({ onOperator, });
      };

      const dateQuery = new Date('2018-12-01');

      const AGE_MIN = 25;
      const AGE_MAX = 35;

      await userModel.query()
        .firstName.is('Guillaume')
        .lastName.isNot('Daix')
        .age.between([ AGE_MIN, AGE_MAX, ])
        .createdAt.greaterThan(dateQuery)
        .findOne();

      expect(onOperator).to.have.been.calledWith({ field: SCHEMA.firstName,
        operator: 'is',
        value: 'Guillaume',
        ancestorFields: null, });
      expect(onOperator).to.have.been.calledWith({ field: SCHEMA.lastName,
        operator: 'isNot',
        value: 'Daix',
        ancestorFields: null, });
      expect(onOperator).to.have.been.calledWith({ field: SCHEMA.age,
        operator: 'between',
        value: [ AGE_MIN, AGE_MAX, ],
        ancestorFields: null, });
      expect(onOperator).to.have.been.calledWith({ field: SCHEMA.createdAt,
        operator: 'greaterThan',
        value: dateQuery,
        ancestorFields: null, });
    });

    it('Should throw an error if the attribute does not exists', () => {
      const query = userModel.query();

      expect(() => query.fakeField).to.throw('The property fakeField does not exists in the defined schema.');
    });

    it('Should call find connector method with query when using Query.find', async () => {
      connector.find = sinon.stub().returns([]);

      const query = userModel.query();

      await query.find();

      expect(connector.find).to.have.been.calledWith(query);
    });

    it('Should call findOne connector method with query when using Query.findOne', async () => {
      connector.findOne = sinon.spy();

      const query = userModel.query();

      await query.findOne();

      expect(connector.findOne).to.have.been.calledWith(query);
    });

    it('Should call count connector method with query when using Query.count', async () => {
      connector.count = sinon.spy();

      const query = userModel.query();

      await query.count();

      expect(connector.count).to.have.been.calledWith(query);
    });

    it('Should call update connector method with query when using Query.update', async () => {
      connector.update = sinon.spy();

      const query = userModel.query();

      await query.update();

      expect(connector.update).to.have.been.calledWith(query);
    });

    it('Should call updateOne connector method with query when using Query.updateOne', async () => {
      connector.updateOne = sinon.spy();

      const query = userModel.query();

      await query.updateOne();

      expect(connector.updateOne).to.have.been.calledWith(query);
    });

    it('Should call remove connector method with query when using Query.remove', async () => {
      connector.remove = sinon.spy();

      const query = userModel.query();

      await query.remove();

      expect(connector.remove).to.have.been.calledWith(query);
    });

    it('Should call removeOne connector method with query when using Query.removeOne', async () => {
      connector.removeOne = sinon.spy();

      const query = userModel.query();

      await query.removeOne();

      expect(connector.removeOne).to.have.been.calledWith(query);
    });
  });
});
