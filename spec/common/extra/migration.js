const { expect, } = require('chai');

const TIME = 1601825250;

module.exports = (TestContext) => {
  const testContext = TestContext.getInvoices();

  describe('Migration', () => {
    const { Schema, } = testContext.ilorm;

    // Always most recent version;
    const userSchema = new Schema({
      id: Schema.string(),
      firstName: Schema.string(),
      lastName: Schema.string(),
      age: Schema.number(),
    });

    it('API up / down should work', () => {
      userSchema
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
      userSchema.version(TIME, {
        id: Schema.string(),
        name: Schema.string(),
        age: Schema.string(),
      });
    });

  });
};
