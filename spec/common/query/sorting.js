
const { expect, } = require('chai');


module.exports = (TestContext) => {
  describe('query.[FIELD].useAsSortAsc', () => {
    let testContext;

    before(() => {
      testContext = TestContext.getStarWars();
    });
    after(() => testContext.finalCleanUp());
    beforeEach(() => testContext.initDb());
    afterEach(() => testContext.cleanDb());

    it('Should sort characters by height ascending', async () => {
      const Characters = testContext.Models.characters;

      const charactersNameSortByHeight = await Characters.query()
        .name.selectOnly()
        .height.useAsSortAsc()
        .find();

      expect(charactersNameSortByHeight).to.deep.equal([
        'Leia Organa',
        'Luke Skywalker',
        'Darth Vador',
        'Chewbacca',
      ]);
    });
  });

  describe('query.[FIELD].useAsSortDesc', () => {
    let testContext;

    before(() => {
      testContext = TestContext.getStarWars();
    });
    after(() => testContext.finalCleanUp());
    beforeEach(() => testContext.initDb());
    afterEach(() => testContext.cleanDb());

    it('Should sort characters by height descending', async () => {
      const Characters = testContext.Models.characters;

      const charactersNameSortByHeight = await Characters.query()
        .name.selectOnly()
        .height.useAsSortDesc()
        .find();

      expect(charactersNameSortByHeight).to.deep.equal([
        'Chewbacca',
        'Darth Vador',
        'Luke Skywalker',
        'Leia Organa',
      ]);
    });
  });
};
