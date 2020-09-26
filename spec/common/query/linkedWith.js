const { expect, } = require('chai');

module.exports = (TestContext) => {
  const testContext = TestContext.getInvoices();

  describe('query.restrictTo', () => {
    beforeEach(() => testContext.initDb());
    afterEach(() => testContext.cleanDb());
    after(() => testContext.finalCleanUp());

    it('linkedWith operator work with an instance id', async () => {
      const Invoices = testContext.Models.invoices;
      const Customers = testContext.Models.customers;

      const CUSTOMER_ID = Customers.id(testContext.GUILLAUME);

      const invoices = await Invoices.query()
        .linkedWith(CUSTOMER_ID)
        .find();

      expect(invoices).to.deep.includes([
        testContext.getInvoicesFixture().INVOICE_GUILLAUME_1,
        testContext.getInvoicesFixture().INVOICE_GUILLAUME_2,
      ]);
    });

    it('linkedWith operator work with an instance', async () => {
      const Invoices = testContext.Models.invoices;
      const Customers = testContext.Models.customers;

      const customer = await Customers.query()
        // eslint-disable-next-line
        [testContext.idFieldName].is(testContext.ID.GUILLAUME)
        .findOne();

      const invoices = await Invoices.query()
        .linkedWith(customer)
        .find();

      expect(invoices).to.deep.includes([
        testContext.getInvoicesFixture().INVOICE_GUILLAUME_1,
        testContext.getInvoicesFixture().INVOICE_GUILLAUME_2,
      ]);
    });

    it('linkedWith operator work with a query', async () => {
      const Invoices = testContext.Models.invoices;
      const Customers = testContext.Models.customers;

      const invoices = await Invoices.query()
        .linkedWith(
          Customers.query()
          // eslint-disable-next-line
          [testContext.idFieldName].is(testContext.ID.GUILLAUME)
        )
        .find();

      expect(invoices).to.deep.includes([
        testContext.getInvoicesFixture().INVOICE_GUILLAUME_1,
        testContext.getInvoicesFixture().INVOICE_GUILLAUME_2,
      ]);
    });
  });
};
