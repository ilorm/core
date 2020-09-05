
const { expect, } = require('chai');

module.exports = (TestContext) => {

  const testContext = TestContext.getStarWars();
  const { CHEWBACCA, LUKE, LEIA, DARTH_VADOR, } = testContext.fixtures.getCharactersFixture();

  describe('query.stream', () => {
    beforeEach(() => testContext.initDb());
    afterEach(() => testContext.cleanDb());

    it('Should stream all elements', async () => {
      const Characters = testContext.Models.characters;

      const nameStream = await Characters.query()
        .name.selectOnly()
        .stream();

      const names = [];

      await new Promise((resolve, reject) => {
        nameStream.on('data', (data) => names.push(data));

        nameStream.on('error', reject);
        nameStream.on('end', resolve);
      });

      // eslint-disable-next-line no-magic-numbers
      expect(names.length).to.equal(4);
      expect(names).to.have.members([
        DARTH_VADOR.name,
        LEIA.name,
        LUKE.name,
        CHEWBACCA.name,
      ]);
    });

    it('Should stream a subset of elements', async () => {
      const Characters = testContext.Models.characters;

      const nameStream = await Characters.query()
        .name.selectOnly()
        .name.is(CHEWBACCA.name)
        .stream();

      const names = [];

      await new Promise((resolve, reject) => {
        nameStream.on('data', (data) => names.push(data));

        nameStream.on('error', reject);
        nameStream.on('end', resolve);
      });

      expect(names.length).to.equal(1);
      expect(names).to.have.members([
        CHEWBACCA.name,
      ]);
    });
  });
};
