const { expect, } = require('chai');

module.exports = (TestContext) => {

  const testContext = TestContext.getStarWars();
  const { CHEWBACCA, DARTH_VADOR, LEIA, LUKE, } = testContext.fixtures.getCharactersFixture();

  describe('query[NumberField]', () => {
    after(() => testContext.finalCleanUp());

    describe('query operator', () => {
      beforeEach(() => testContext.initDb());
      afterEach(() => testContext.cleanDb());

      it('Should query with operator is', async () => {
        const Characters = testContext.Models.characters;

        const character = await Characters.query()
          .height.is(CHEWBACCA.height)
          .findOne();

        expect(character).to.be.deep.include(CHEWBACCA);
      });

      it('Should query with operator isNot', async () => {
        const Characters = testContext.Models.characters;

        const characters = await Characters.query()
          .height.isNot(CHEWBACCA.height)
          .find();

        // eslint-disable-next-line no-magic-numbers
        expect(characters.length).to.be.equal(3);

        expect(characters.find((char) => char.name === LEIA.name)).to.be.deep.include(LEIA);
        expect(characters.find((char) => char.name === LUKE.name)).to.be.deep.include(LUKE);
        expect(characters.find((char) => char.name === DARTH_VADOR.name)).to.be.deep.include(DARTH_VADOR);
      });

      it('Should query with operator isIn', async () => {
        const Characters = testContext.Models.characters;

        const characters = await Characters.query()
          .height.isIn([
            CHEWBACCA.height,
            DARTH_VADOR.height,
          ])
          .find();

        // eslint-disable-next-line no-magic-numbers
        expect(characters.length).to.be.equal(2);

        expect(characters.find((char) => char.name === CHEWBACCA.name)).to.be.deep.include(CHEWBACCA);
        expect(characters.find((char) => char.name === DARTH_VADOR.name)).to.be.deep.include(DARTH_VADOR);
      });

      it('Should query with operator isNotIn', async () => {
        const Characters = testContext.Models.characters;

        const characters = await Characters.query()
          .height.isNotIn([
            CHEWBACCA.height,
            DARTH_VADOR.height,
          ])
          .find();

        // eslint-disable-next-line no-magic-numbers
        expect(characters.length).to.be.equal(2);

        expect(characters.find((char) => char.name === LEIA.name)).to.be.deep.include(LEIA);
        expect(characters.find((char) => char.name === LUKE.name)).to.be.deep.include(LUKE);
      });

      it('Should query with operator greaterThan', async () => {
        const Characters = testContext.Models.characters;

        const characters = await Characters.query()
          .height.greaterThan(DARTH_VADOR.height)
          .find();

        // eslint-disable-next-line no-magic-numbers
        expect(characters.length).to.be.equal(1);

        expect(characters.find((char) => char.name === CHEWBACCA.name)).to.be.deep.include(CHEWBACCA);
      });

      it('Should query with operator greaterOrEqualThan', async () => {
        const Characters = testContext.Models.characters;

        const characters = await Characters.query()
          .height.greaterOrEqualThan(DARTH_VADOR.height)
          .find();

        // eslint-disable-next-line no-magic-numbers
        expect(characters.length).to.be.equal(2);


        expect(characters.find((char) => char.name === CHEWBACCA.name)).to.be.deep.include(CHEWBACCA);
        expect(characters.find((char) => char.name === DARTH_VADOR.name)).to.be.deep.include(DARTH_VADOR);
      });

      it('Should query with operator lowerThan', async () => {
        const Characters = testContext.Models.characters;

        const characters = await Characters.query()
          .height.lowerThan(LUKE.height)
          .find();

        // eslint-disable-next-line no-magic-numbers
        expect(characters.length).to.be.equal(1);

        expect(characters.find((char) => char.name === LEIA.name)).to.be.deep.include(LEIA);
      });

      it('Should query with operator lowerOrEqualThan', async () => {
        const Characters = testContext.Models.characters;

        const characters = await Characters.query()
          .height.lowerOrEqualThan(LUKE.height)
          .find();

        // eslint-disable-next-line no-magic-numbers
        expect(characters.length).to.be.equal(2);

        expect(characters.find((char) => char.name === LEIA.name)).to.be.deep.include(LEIA);
        expect(characters.find((char) => char.name === LUKE.name)).to.be.deep.include(LUKE);
      });

      it('Should query with operator between', async () => {
        const Characters = testContext.Models.characters;

        const characters = await Characters.query()
          .height.between({
            min: LEIA.height,
            max: CHEWBACCA.height,
          })
          .find();

        // eslint-disable-next-line no-magic-numbers
        expect(characters.length).to.be.equal(2);

        expect(characters.find((char) => char.name === DARTH_VADOR.name)).to.be.deep.include(DARTH_VADOR);
        expect(characters.find((char) => char.name === LUKE.name)).to.be.deep.include(LUKE);
      });
    });

    describe('update operator', () => {
      beforeEach(() => testContext.initDb());
      afterEach(() => testContext.cleanDb());

      it('Should update with operator set', async () => {
        const Characters = testContext.Models.characters;

        await Characters.query()
          // eslint-disable-next-line no-magic-numbers
          .height.set(200)
          .name.is(LUKE.name)
          .updateOne();

        const luke = await Characters.query()
          .name.is(LUKE.name)
          .findOne();

        // eslint-disable-next-line no-magic-numbers
        expect(luke.height).to.be.equal(200);
      });

      it('Should update with operator add', async () => {
        const Characters = testContext.Models.characters;

        await Characters.query()
          // eslint-disable-next-line no-magic-numbers
          .height.add(10)
          .name.is(LUKE.name)
          .updateOne();

        const luke = await Characters.query()
          .name.is(LUKE.name)
          .findOne();

        // eslint-disable-next-line no-magic-numbers
        expect(luke.height).to.be.equal(LUKE.height + 10);
      });
    });
  });
};
