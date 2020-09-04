
const { expect, } = require('chai');

module.exports = (TestContext) => {

  describe('query.[FIELD].select', () => {
    let testContext;

    before(() => {
      testContext = new TestContext();
    });
    after(() => testContext.finalCleanUp());
    beforeEach(() => testContext.initDb());
    afterEach(() => testContext.cleanDb());

    it('Should select only one field from query', async () => {
      const Characters = testContext.Models.characters;

      const char = await Characters.query()
        .name.select()
        .name.is('Luke Skywalker')
        .findOne();

      expect(Object.keys(char)).to.deep.equal([ 'name', ]);
      expect(char.name).to.be.equal('Luke Skywalker');
    });

    it('Should select two one fields from query', async () => {
      const Characters = testContext.Models.characters;

      const char = await Characters.query()
        .name.select()
        .gender.select()
        .name.is('Luke Skywalker')
        .findOne();

      expect(Object.keys(char)).to.deep.equal([ 'name', 'gender', ]);
      expect(char.name).to.be.equal('Luke Skywalker');
      expect(char.gender).to.be.equal('M');
    });
  });

  describe('query.[FIELD].selectOnly', () => {
    let testContext;

    before(() => {
      testContext = new TestContext();
    });
    after(() => testContext.finalCleanUp());
    beforeEach(() => testContext.initDb());
    afterEach(() => testContext.cleanDb());

    it('Should selectOnly one field from query', async () => {
      const Characters = testContext.Models.characters;

      const name = await Characters.query()
        .name.selectOnly()
        .name.is('Luke Skywalker')
        .findOne();

      expect(name).to.be.equal('Luke Skywalker');
    });

    it('Should throw an error if trying to selectOnly multiple fields', () => {
      const Characters = testContext.Models.characters;

      // eslint-disable-next-line require-jsdoc
      const queryFactory = () => Characters.query()
        .name.selectOnly()
        .gender.selectOnly()
        .name.is('Luke Skywalker')
        .findOne();

      expect(queryFactory).to.throw('Could not select only field gender, if you already selected others fields.');
    });
  });
};
