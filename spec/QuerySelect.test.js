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
});

const userModel = newModel({
  schema,
  connector,
});


describe('spec ilorm', () => {
  describe('Query', () => {
    it('Without select, will return all object without applying any select', async () => {
      const onSelect = sinon.spy();
      connector.findOne = query => {
        query.queryBuilder({ onSelect });

        return {
          firstName: 'Guillaume',
          lastName: 'Daix',
          age: 29,
        };
      };

      const user = await userModel.query()
        .findOne();

      expect(onSelect).to.have.not.been.calledWith({ field: 'firstName', });
      expect(onSelect).to.have.not.been.calledWith({ field: 'age', });
      expect(onSelect).to.have.not.been.calledWith({ field: 'lastName', });
    });

    it('Should use select to get only few field from a direct query', async () => {
      const onSelect = sinon.spy();
      connector.findOne = query => {
        query.queryBuilder({ onSelect });

        return {
          firstName: 'Guillaume',
          lastName: 'Daix',
          age: 29,
        };
      };

      const user = await userModel.query()
        .firstName.select()
        .lastName.select()
        .findOne();

      expect(onSelect).to.have.been.calledWith({ field: 'firstName', });
      expect(onSelect).to.have.not.been.calledWith({ field: 'age', });
      expect(onSelect).to.have.been.calledWith({ field: 'lastName', });
    });

    it('Should use selectOnly to get only one field from a direct query', async () => {
      const onSelect = sinon.spy();
      connector.findOne = query => {
        query.queryBuilder({ onSelect });

        return {
          firstName: 'Guillaume',
          lastName: 'Daix',
        };
      };

      const firstName = await userModel.query()
        .firstName.selectOnly()
        .findOne();

      expect(firstName).to.be.equal('Guillaume');
      expect(onSelect).to.have.been.calledWith({ field: 'firstName', });
    });

    it('Should not use selectOnly after have starting using select', async () => {
      const onSelect = sinon.spy();
      connector.findOne = query => {
        query.queryBuilder({ onSelect });

        return {
          firstName: 'Guillaume',
          lastName: 'Daix',
        };
      };

      const query = userModel.query()
        .firstName.select();

      expect(query.lastName.selectOnly).to.throw('Could not select only field lastName, if you already selected others fields.');
    });

    it('Should not use select after have starting using selectOnly', async () => {
      const onSelect = sinon.spy();
      connector.findOne = query => {
        query.queryBuilder({ onSelect });

        return {
          firstName: 'Guillaume',
          lastName: 'Daix',
        };
      };

      const query = userModel.query()
        .firstName.selectOnly();

      expect(query.lastName.select).to.throw('Could not select field lastName, if you already selectOnly the field firstName');
    });
  });
});