
const { expect, } = require('chai');

module.exports = TestContext => {
  const testContext = new TestContext();

  describe('query.limit', () => {
    beforeEach(() => testContext.initDb());
    afterEach(() => testContext.cleanDb());

    it('Should limit to one element', async () => {
      const Characters = await testContext.getCharactersModel();

      const characters = await Characters.query()
        .limit(1)
        .find();

      expect(characters.length).to.be.equal(1);
    });
  });

  describe('query.skip', () => {
    beforeEach(() => testContext.initDb());
    afterEach(() => testContext.cleanDb());

    it('Should skip to next element', async () => {
      const Characters = await testContext.getCharactersModel();

      const LIMIT = 2;

      // eslint-disable-next-line require-jsdoc
      const skipQuery = (skipIndex = 0) => Characters.query()
        .skip(skipIndex)
        .limit(LIMIT)
        .find();

      const [elem0, elem1,] = await skipQuery(0);
      const [elem1bis, elem2,] = await skipQuery(1);

      // 0 != 1 && 0 != 1bis && 0 != 2
      expect(elem0).to.not.deep.equal(elem1bis);
      expect(elem0).to.not.deep.equal(elem1);
      expect(elem0).to.not.deep.equal(elem2);

      // 1 === 1bis && 1 !== 2
      expect(elem1).to.deep.equal(elem1bis);
      expect(elem1).to.not.deep.equal(elem2);

      // 1bis !== 2
      expect(elem1bis).to.not.deep.equal(elem2);
    });
  });
};
