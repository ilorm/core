const { expect, } = require('chai');

// Create a clean instance of ilorm :
const Ilorm = require('..').constructor;
const { Schema, } = new Ilorm();

describe('spec ilorm', () => {
  describe('Schema default init', () => {
    it('Without default, the init will do nothing', async () => {
      const schema = new Schema({
        firstName: Schema.string(),
        age: Schema.number(),
      });

      const obj = await schema.init();

      expect(obj).to.deep.equal({});
    });

    it('With default declared, the object will be init with default value if nothing is set', async () => {
      const schema = new Schema({
        firstName: Schema.string().default('guillaume'),
        age: Schema.number(),
      });

      const obj = await schema.init();

      expect(obj).to.deep.equal({
        firstName: 'guillaume',
      });
    });

    it('Default do not erase parameter (if something is set)', async () => {
      const schema = new Schema({
        firstName: Schema.string().default('guillaume'),
        age: Schema.number(),
      });

      const obj = await schema.init({
        firstName: 'John',
      });

      expect(obj).to.deep.equal({
        firstName: 'John',
      });
    });

    it('Default function will be called', async () => {
      const DEFAULT_AGE = 10;

      const schema = new Schema({
        firstName: Schema.string(),
        age: Schema.number().default(() => DEFAULT_AGE),
      });

      const obj = await schema.init();

      expect(obj).to.deep.equal({
        age: DEFAULT_AGE,
      });
    });
  });
});
