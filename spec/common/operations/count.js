const { expect, } = require('chai');

module.exports = (TestContext) => {
  const testContext = new TestContext();
  const { CHEWBACCA, } = testContext.fixtures.getCharactersFixture();

  describe('query.count', () => {
    after(() => testContext.finalCleanUp());
    beforeEach(() => testContext.initDb());
    afterEach(() => testContext.cleanDb());

    it('Should count all element without filters', async () => {
      const Characters = testContext.Models.characters;

      const amount = await Characters.query()
        .count();

      // eslint-disable-next-line no-magic-numbers
      expect(amount).to.equal(4);
    });

    it('Should count a subset of element if filter is set', async () => {
      const Characters = testContext.Models.characters;

      const amount = await Characters.query()
        .name.is(CHEWBACCA.name)
        .count();

      // eslint-disable-next-line no-magic-numbers
      expect(amount).to.equal(1);
    });
  });
};
