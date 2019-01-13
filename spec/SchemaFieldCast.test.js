const { expect, } = require('chai');

// Create a clean instance of ilorm :
const Ilorm = require('..').constructor;
const ilorm = new Ilorm();

describe('spec ilorm', () => {
  describe('Check Schema Field casting feature', () => {
    it('Should cast a boolean value', () => {
      const boolean = new ilorm.Schema.Types.Boolean;

      expect(boolean.castValue('true')).to.be.a('boolean');
    });

    it('Should cast a date value', () => {
      const date = new ilorm.Schema.Types.Date;

      expect(date.castValue('11/11/2018')).to.be.a('date');
    });

    it('Should cast a number value', () => {
      const number = new ilorm.Schema.Types.Number;

      expect(number.castValue('33')).to.be.a('number');
    });

    it('Should cast a string value', () => {
      const string = new ilorm.Schema.Types.String;

      expect(string.castValue(0)).to.be.a('string');
    });
  });
});
