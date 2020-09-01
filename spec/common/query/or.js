const { expect, } = require('chai');

module.exports = (TestContext, fixtures) => {
  const { CHEWBACCA, LUKE, } = fixtures;
  const testContext = new TestContext();

  describe('query.or', () => {
    beforeEach(() => testContext.initDb());
    afterEach(() => testContext.cleanDb());

    it('Should create query with or operator', async () => {
      const Characters = await testContext.getCharactersModel();

      const names = await Characters.query()
        .name.selectOnly()
        .or(branch => {
          // name is CHEWBACCA or LUKE;
          branch().name.is(CHEWBACCA.name);
          branch().name.is(LUKE.name);
        })
        .find();

      // eslint-disable-next-line no-magic-numbers
      expect(names.length).to.equal(2);
      expect(names).to.have.members([
        CHEWBACCA.name,
        LUKE.name,
      ]);
    });
  });
};
