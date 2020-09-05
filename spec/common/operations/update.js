const { expect, } = require('chai');

module.exports = (TestContext) => {
  const testContext = TestContext.getStarWars();
  const { CHEWBACCA, LUKE, LEIA, DARTH_VADOR, } = testContext.fixtures.getCharactersFixture();

  describe('query.update', () => {
    after(() => testContext.finalCleanUp());
    beforeEach(() => testContext.initDb());
    afterEach(() => testContext.cleanDb());

    it('Should update all elements', async () => {
      const Characters = testContext.Models.characters;

      const amountUpdated = await Characters.query()
        .name.set('new_name')
        .update();

      const names = await Characters.query()
        .name.selectOnly()
        .find();


      // eslint-disable-next-line no-magic-numbers
      expect(names.length).to.equal(4);
      expect(names).to.have.members([
        'new_name',
        'new_name',
        'new_name',
        'new_name',
      ]);
      // eslint-disable-next-line no-magic-numbers
      expect(amountUpdated).to.equal(4);
    });

    it('Should update a subset of element if filter is set', async () => {
      const Characters = testContext.Models.characters;

      const amountUpdated = await Characters.query()
        .name.is(CHEWBACCA.name)
        .name.set('new_name')
        .update();

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
  });
};
