const { expect, } = require('chai');

module.exports = (TestContext) => {
  const testContext = TestContext.getStarWars();
  const { CHEWBACCA, LUKE, LEIA, DARTH_VADOR, } = testContext.fixtures.getCharactersFixture();


  describe('query.updateOne', () => {
    after(() => testContext.finalCleanUp());
    beforeEach(() => testContext.initDb());
    afterEach(() => testContext.cleanDb());

    it('Should update one elements without filter', async () => {
      const Characters = testContext.Models.characters;

      const amountUpdated = await Characters.query()
        .name.set('new_name')
        .updateOne();

      const amount = await Characters.query()
        .name.is('new_name')
        .count();

      // eslint-disable-next-line no-magic-numbers
      expect(amount).to.equal(1);
      // eslint-disable-next-line no-magic-numbers
      expect(amountUpdated).to.equal(1);
    });

    it('Should update one given element if filter is set', async () => {
      const Characters = testContext.Models.characters;

      const amountUpdated = await Characters.query()
        .name.is(CHEWBACCA.name)
        .name.set('new_name')
        .updateOne();

      const names = await Characters.query()
        .name.selectOnly()
        .find();

      // eslint-disable-next-line no-magic-numbers
      expect(amountUpdated).to.equal(1);
      // eslint-disable-next-line no-magic-numbers
      expect(names.length).to.equal(4);
      expect(names).to.have.members([
        'new_name',
        DARTH_VADOR.name,
        LEIA.name,
        LUKE.name,
      ]);
    });

    it('Should remove nothing if filter target an unknow value', async () => {
      const Characters = testContext.Models.characters;

      const amountUpdated = await Characters.query()
        .name.is('a non star wars character')
        .name.set('new_name')
        .removeOne();

      const amount = await Characters.query()
        .name.is('new_name')
        .count();

      // eslint-disable-next-line no-magic-numbers
      expect(amount).to.equal(0);
      // eslint-disable-next-line no-magic-numbers
      expect(amountUpdated).to.equal(0);
    });
  });
};
