const { expect, } = require('chai');

// Create a clean instance of ilorm :
const Ilorm = require('..').constructor;
const ilorm = new Ilorm();
const { Schema } = ilorm;

describe('spec ilorm', () => {
  describe('Check Schema Field casting feature', () => {
    it('1 - Plugin can declare if it listen specific field value in SchemaField', () => {
      Schema.declarePluginOption('pluginField');

      const schema = new Schema({});

      expect(schema.pluginField.length).to.be.equal(0);
    });

    it('2 - SchemaField with specific attribute field need will be identified', () => {
      const trackedField = Schema.boolean();
      trackedField.pluginField = true;

      const schema = new Schema({
        tracked: trackedField,
        notTracked: Schema.boolean(),
      });

      expect(schema.getFieldsAssociatedWithPlugin('pluginField')).to.be.deep.equal([
        'tracked',
      ]);
    });

    it('3 - SchemaField with unknown attribute field need will not be identified', () => {
      const trackedField = Schema.boolean();
      trackedField.anotherField = true;

      const schema = new Schema({
        tracked: trackedField,
        notTracked: Schema.boolean(),
      });

      expect(schema.getFieldsAssociatedWithPlugin('anotherField')).to.be.deep.equal([]);
    });
  });
});
