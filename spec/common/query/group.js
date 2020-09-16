const { expect, } = require('chai');

module.exports = (TestContext) => {
  const testContext = TestContext.getInvoices();

  describe('Group', () => {
    after(() => testContext.finalCleanUp());
    beforeEach(() => testContext.initDb());
    afterEach(() => testContext.cleanDb());

    it('Should group data and apply operation', async () => {
      const Invoices = testContext.Models.invoices;

      const result = await Invoices.query()
        .groupBy(Invoices.FIELDS.userId)
        // eslint-disable-next-line newline-per-chained-call
        .define('totalDebt').asSumOf(Invoices.FIELDS.amount)
        // eslint-disable-next-line newline-per-chained-call
        .define('nbInvoices').asCountOf(Invoices)
        .find();

      expect(result).to.be.deep.equal([
        {
          userId: testContext.fixtures.ID.CUSTOMERS.GUILLAUME,
          nbInvoices: 2,
          totalDebt: 450,
        },
      ]);
    });
  });
};
