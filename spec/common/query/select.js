
const { expect, } = require('chai');

module.exports = TestContext => {
  const testContext = new TestContext();

  describe('query.[FIELD].select', () => {
    beforeEach(() => testContext.initDb());
    afterEach(() => testContext.cleanDb());

    it('Should select only one field from query', async () => {
      const Characters = await testContext.getCharactersModel();

      const char = await Characters.query()
        .name.select()
        .name.is('Luke Skywalker')
        .findOne();

      expect(Object.keys(char)).to.deep.equal(['name',]);
      expect(char.name).to.be.equal('Luke Skywalker');
    });

    it('Should select two one fields from query', async () => {
      const Characters = await testContext.getCharactersModel();

      const char = await Characters.query()
        .name.select()
        .gender.select()
        .name.is('Luke Skywalker')
        .findOne();

      expect(Object.keys(char)).to.deep.equal(['name', 'gender',]);
      expect(char.name).to.be.equal('Luke Skywalker');
      expect(char.gender).to.be.equal('M');
    });
  });

  describe('query.[FIELD].selectOnly', () => {
    beforeEach(() => testContext.initDb());
    afterEach(() => testContext.cleanDb());

    it('Should selectOnly one field from query', async () => {
      const Characters = await testContext.getCharactersModel();

      const name = await Characters.query()
        .name.selectOnly()
        .name.is('Luke Skywalker')
        .findOne();

      expect(name).to.be.equal('Luke Skywalker');
    });

    it('Should throw an error if trying to selectOnly multiple fields', async () => {
      const Characters = await testContext.getCharactersModel();

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
