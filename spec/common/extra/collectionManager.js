const { expect, } = require('chai');

module.exports = (TestContext) => {
  describe('CollectionManager', () => {
    const testContext = new TestContext();
    const { ilorm, Connector, } = testContext;

    before(() => testContext.deleteSource('collectionName'));
    after(() => testContext.finalCleanUp());

    it('Should create usable collection', async () => {
      const RAW_SCHEMA = {
        name: ilorm.Schema.string(),
        height: ilorm.Schema.number(),
      };

      const schema = new ilorm.Schema(RAW_SCHEMA);

      await Connector.getCollectionManager().create({
        name: 'collectionName',
        schema: RAW_SCHEMA,
      });

      const Model = ilorm.newModel({
        schema,
        connector: new Connector({ sourceName: 'collectionName', }),
      });

      const instance = new Model();

      instance.name = 'Guillaume';
      instance.height = 187;
      await instance.save();

      const fromDb = await Model.query().findOne();

      expect(fromDb.name).to.be.equals('Guillaume');
      // eslint-disable-next-line no-magic-numbers
      expect(fromDb.height).to.be.equals(187);
    });

    it('Should check if a collection exists', async () => {
      const isExists = await Connector.getCollectionManager().isExists({ name: 'collectionName', });

      expect(isExists).to.be.equals(true);
    });

    it('Should rename a column', async () => {
      const RAW_SCHEMA = {
        newName: ilorm.Schema.string(),
        height: ilorm.Schema.number(),
      };
      const schema = new ilorm.Schema(RAW_SCHEMA);
      const Model = ilorm.newModel({
        schema,
        connector: new Connector({ sourceName: 'collectionName', }),
      });

      await Connector.getCollectionManager().renameFields({
        name: 'collectionName',
        toRename: [
          {
            oldName: 'name',
            newName: 'firstName',
          },
        ],
      });

      const fromDb = await Model.query().findOne();

      expect(fromDb.firstName).to.be.equals('Guillaume');
      // eslint-disable-next-line no-magic-numbers
      expect(fromDb.height).to.be.equals(187);
    });

    it('Should apply a new schema to an existing one', async () => {
      const RAW_SCHEMA = {
        createdAt: ilorm.Schema.date(),
        isNew: ilorm.Schema.boolean(),
      };


      await Connector.getCollectionManager().alter({
        name: 'collectionName',
        schema: RAW_SCHEMA,
      });

      const schema = new ilorm.Schema(RAW_SCHEMA);
      const Model = ilorm.newModel({
        schema,
        connector: new Connector({ sourceName: 'collectionName', }),
      });

      const newDate = new Date('2020-10-12');

      await Model.query()
        .isNew.set(true)
        .createdAt.set(newDate)
        .updateOne();

      const fromDb = await Model.query().findOne();

      expect(fromDb.firstName).to.be.equals('Guillaume');
      // eslint-disable-next-line no-magic-numbers
      expect(fromDb.height).to.be.equals(187);
      expect(fromDb.isNew).to.be.equals(true);
      expect(fromDb.createdAt).to.be.deep.equals(newDate);

    });

    it('Should delete some columns', async () => {
      const RAW_SCHEMA = {
        createdAt: ilorm.Schema.date(),
        isNew: ilorm.Schema.boolean(),
      };


      await Connector.getCollectionManager().deleteFields({
        name: 'collectionName',
        fieldsToDrop: [ 'createdAt', 'height', ],
      });

      const schema = new ilorm.Schema(RAW_SCHEMA);
      const Model = ilorm.newModel({
        schema,
        connector: new Connector({ sourceName: 'collectionName', }),
      });


      const fromDb = await Model.query().findOne();

      expect(fromDb.firstName).to.be.equals('Guillaume');
      // eslint-disable-next-line no-magic-numbers
      expect(fromDb.isNew).to.be.equals(true);
      expect(fromDb.height).to.be.equals(undefined);
      expect(fromDb.createdAt).to.be.equals(null);
    });

    it('Should delete a collection', async () => {
      await Connector.getCollectionManager().delete({ name: 'collectionName', });
    });
  });
};
