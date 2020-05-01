const { expect, } = require('chai');

// Create a clean instance of ilorm :
const Ilorm = require('..').constructor;
const ilorm = new Ilorm();

describe('spec ilorm', () => {
  describe('Required field', () => {
    it('Undefined required field are not valid', async () => {
      const boolean = new ilorm.Schema.Types.Boolean();

      boolean.required();

      expect(await boolean.isValid()).to.be.equal(false);
    });

    it('Undefined unrequired field are valid', async () => {
      const boolean = new ilorm.Schema.Types.Boolean();

      boolean.required(false);

      expect(await boolean.isValid()).to.be.equal(true);
    });

    it('Per default field are unrequired', async () => {
      const boolean = new ilorm.Schema.Types.Boolean();

      expect(await boolean.isValid()).to.be.equal(true);
    });
  });
});
