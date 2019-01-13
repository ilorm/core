const { expect, } = require('chai');

// Create a clean instance of ilorm :
const Ilorm = require('..').constructor;
const ilorm = new Ilorm();

describe('spec ilorm', () => {
  describe('Check factory alias could instantiate schema field', () => {
    it('Should instantiate Boolean schema field with factory boolean', () => {
      const booleanField = ilorm.Schema.boolean();

      expect(booleanField).to.be.instanceof(ilorm.Schema.Types.Boolean);
    });

    it('Should instantiate Date schema field with factory date', () => {
      const booleanField = ilorm.Schema.date();

      expect(booleanField).to.be.instanceof(ilorm.Schema.Types.Date);
    });

    it('Should instantiate Number schema field with factory number', () => {
      const booleanField = ilorm.Schema.number();

      expect(booleanField).to.be.instanceof(ilorm.Schema.Types.Number);
    });

    it('Should instantiate Reference schema field with factory reference', () => {
      const booleanField = ilorm.Schema.reference();

      expect(booleanField).to.be.instanceof(ilorm.Schema.Types.Reference);
    });

    it('Should instantiate String schema field with factory string', () => {
      const booleanField = ilorm.Schema.string();

      expect(booleanField).to.be.instanceof(ilorm.Schema.Types.String);
    });
  });
});
