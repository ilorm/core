const { expect, } = require('chai');

const TIME_V1 = 1581125250;
const TIME_V2 = 1601825250;
const TIME_V3 = 1611825250;

module.exports = (TestContext) => {
  const testContext = new TestContext();

  describe('Migration', () => {
    after(async () => {
      await testContext.deleteSource('users');

      return testContext.finalCleanUp();
    });

    const { Schema, newModel, } = testContext.ilorm;

    // Always most recent version;
    const userSchema = new Schema({
      id: Schema.string(),
      firstName: Schema.string(),
      lastName: Schema.string(),
      age: Schema.number(),
    });

    it('API up / down should work', () => {
      userSchema
        .version(TIME_V3)
        .up((UserModel) => {
          UserModel.query()
            .stream()
            .on('data', (user) => {
              const [ firstName, lastName, ] = user.name.split(' ');

              user.firstName = firstName;
              user.lastName = lastName;
              user.age = parseInt(user.previous.age);
              user.save();
            });
        })
        .down((UserModel) => {
          UserModel.query()
            .stream()
            .on('data', (user) => {
              user.name = `${user.firstName} ${user.lastName}`;
              user.age = `${user.previous.age}`;
              user.save();
            });
        });
    });

    it('API version should work', () => {
      userSchema
        .version(TIME_V2, {
          id: Schema.string(),
          name: Schema.string(),
          age: Schema.string(),
        })
        .version(TIME_V1, {
          id: Schema.string(),
          name: Schema.string(),
        })
        .up(async (UserModel) => {
          const user = new UserModel();

          user.id = '12345';
          user.name = 'Guillaume Daix';

          await user.save();
        });
    });

    let UserModel;

    it('Should build db with the most recent schema', async () => {
      UserModel = newModel({
        connector: new testContext.Connector({
          sourceName: 'users',
        }),
        schema: userSchema,
      });

      // Will apply migration in order;
      await UserModel.applyMigration();

      // The migration TIME_V1 insert a user on an old schema, in theory, still in the db;
      const user = await UserModel.query().findOne();

      expect(user.id).to.be.equals('12345');
      expect(user.firstName).to.be.equals('Guillaume');
      expect(user.lastName).to.be.equals('Daix');
    });

    it('Should rollback on past schema', () => {});

    it('Should re-up on last schema', () => {});
  });
};
