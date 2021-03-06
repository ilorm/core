const { expect, } = require('chai');

module.exports = (TestContext) => {
  describe('query.find', () => {
    const testContext = TestContext.getStarWars();
    const { CHEWBACCA, } = testContext.fixtures.getCharactersFixture();

    beforeEach(() => testContext.initDb());
    afterEach(() => testContext.cleanDb());
    after(() => testContext.finalCleanUp());

    it('Should find all element without filters', async () => {
      const Characters = testContext.Models.characters;

      const elements = await Characters.query()
        .find();

      // eslint-disable-next-line no-magic-numbers
      expect(elements.length).to.equal(4);
    });

    it('Should find a subset of element if filter is set', async () => {
      const Characters = testContext.Models.characters;

      const elements = await Characters.query()
        .name.is(CHEWBACCA.name)
        .find();

      // eslint-disable-next-line no-magic-numbers
      expect(elements.length).to.equal(1);

      expect(elements[0]).to.deep.include(CHEWBACCA);
    });
  });

  describe('query.findOne', () => {
    const testContext = TestContext.getStarWars();
    const { CHEWBACCA, } = testContext.fixtures.getCharactersFixture();

    beforeEach(() => testContext.initDb());
    afterEach(() => testContext.cleanDb());
    after(() => testContext.finalCleanUp());

    it('Should find only one element without filters', async () => {
      const Characters = testContext.Models.characters;

      const element = await Characters.query()
        .findOne();

      // eslint-disable-next-line no-magic-numbers
      expect(element).to.be.an('object');
    });

    it('Should find a given element if filter is set', async () => {
      const Characters = testContext.Models.characters;

      const element = await Characters.query()
        .name.is(CHEWBACCA.name)
        .findOne();

      expect(element).to.deep.include(CHEWBACCA);
    });

    it('Should return null if no element match', async () => {
      const Characters = testContext.Models.characters;

      const element = await Characters.query()
        .name.is('fake name')
        .findOne();

      expect(element).to.equal(null);
    });
  });
};
