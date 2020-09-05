const { expect, } = require('chai');

module.exports = (TestContext) => {
  const testContext = TestContext.getStarWars();
  const { CHEWBACCA, } = testContext.fixtures.getCharactersFixture();

  describe('query.find', () => {
    beforeEach(() => testContext.initDb());
    afterEach(() => testContext.cleanDb());

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

      expect(elements[0]).to.include(CHEWBACCA);
    });
  });

  describe('query.findOne', () => {
    beforeEach(() => testContext.initDb());
    afterEach(() => testContext.cleanDb());

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

      expect(element).to.include(CHEWBACCA);
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
