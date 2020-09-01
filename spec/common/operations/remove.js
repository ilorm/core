
const { expect, } = require('chai');

module.exports = (TestContext, fixtures) => {
  const { CHEWBACCA, DARTH_VADOR, LEIA, LUKE, } = fixtures;
  const testContext = new TestContext();


  describe('query.remove', () => {
    beforeEach(() => testContext.initDb());
    afterEach(() => testContext.cleanDb());

    it('Should remove all elements', async () => {
      const Characters = await testContext.getCharactersModel();

      const amountRemoved = await Characters.query()
        .remove();

      const amount = await Characters.query()
        .count();

      // eslint-disable-next-line no-magic-numbers
      expect(amount).to.equal(0);
      // eslint-disable-next-line no-magic-numbers
      expect(amountRemoved).to.equal(4);
    });

    it('Should remove a subset of element if filter is set', async () => {
      const Characters = await testContext.getCharactersModel();

      const amountRemoved = await Characters.query()
        .name.is(CHEWBACCA.name)
        .remove();

      const names = await Characters.query()
        .name.selectOnly()
        .find();

      // eslint-disable-next-line no-magic-numbers
      expect(amountRemoved).to.equal(1);

      // eslint-disable-next-line no-magic-numbers
      expect(names.length).to.equal(3);
      expect(names).to.have.members([
        DARTH_VADOR.name,
        LEIA.name,
        LUKE.name,
      ]);
    });
  });

  describe('query.removeOne', () => {
    beforeEach(() => testContext.initDb());
    afterEach(() => testContext.cleanDb());

    it('Should remove one elements without filter', async () => {
      const Characters = await testContext.getCharactersModel();

      const amountRemoved = await Characters.query()
        .removeOne();

      const amount = await Characters.query()
        .count();

      // eslint-disable-next-line no-magic-numbers
      expect(amount).to.equal(3);
      // eslint-disable-next-line no-magic-numbers
      expect(amountRemoved).to.equal(1);
    });

    it('Should remove one element if filter is set', async () => {
      const Characters = await testContext.getCharactersModel();

      const amountRemoved = await Characters.query()
        .name.is(CHEWBACCA.name)
        .removeOne();

      const names = await Characters.query()
        .name.selectOnly()
        .find();

      // eslint-disable-next-line no-magic-numbers
      expect(amountRemoved).to.equal(1);
      // eslint-disable-next-line no-magic-numbers
      expect(names.length).to.equal(3);
      expect(names).to.have.members([
        DARTH_VADOR.name,
        LEIA.name,
        LUKE.name,
      ]);
    });

    it('Should remove nothing if filter target an unknow value', async () => {

      const Characters = await testContext.getCharactersModel();

      const amountRemoved = await Characters.query()
        .name.is('a non star wars character')
        .removeOne();

      const amount = await Characters.query()
        .count();

      // eslint-disable-next-line no-magic-numbers
      expect(amount).to.equal(4);
      // eslint-disable-next-line no-magic-numbers
      expect(amountRemoved).to.equal(0);
    });
  });
};
