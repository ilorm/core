const { expect, } = require('chai');

module.exports = (TestContext) => {
  const testContext = TestContext.getInvoices();
  const { fixtures, } = testContext;

  describe('query.linkedWith', () => {

    describe('parameters', () => {
      beforeEach(async () => {
        await testContext.initDb();
        await testContext.ilorm.Relation.waitForRelationToInit();
      });
      afterEach(() => testContext.cleanDb());
      after(() => testContext.finalCleanUp());


      it('linkedWith operator work with an instance id', async () => {
        const Invoices = testContext.Models.invoices;
        const Customers = testContext.Models.customers;

        const CUSTOMER_ID = Customers.id(fixtures.ID.CUSTOMERS.GUILLAUME);

        const invoices = await Invoices.query()
          .linkedWith(CUSTOMER_ID)
          .find();

        expect(invoices).to.deep.members([
          fixtures.getInvoicesFixture().INVOICE_GUILLAUME_1,
          fixtures.getInvoicesFixture().INVOICE_GUILLAUME_2,
        ]);
      });

      it('linkedWith operator work with an instance', async () => {
        const Invoices = testContext.Models.invoices;
        const Customers = testContext.Models.customers;

        const customer = await Customers.query()
          // eslint-disable-next-line
          [fixtures.idFieldName].is(fixtures.ID.CUSTOMERS.GUILLAUME)
          .findOne();

        const invoices = await Invoices.query()
          .linkedWith(customer)
          .find();

        expect(invoices).to.deep.members([
          fixtures.getInvoicesFixture().INVOICE_GUILLAUME_1,
          fixtures.getInvoicesFixture().INVOICE_GUILLAUME_2,
        ]);
      });

      it('linkedWith operator work with a query', async () => {
        const Invoices = testContext.Models.invoices;
        const Customers = testContext.Models.customers;

        const invoices = await Invoices.query()
          .linkedWith(
            Customers.query()
              .lastName.is('Daix')
          )
          .find();

        expect(invoices).to.deep.members([
          fixtures.getInvoicesFixture().INVOICE_GUILLAUME_1,
          fixtures.getInvoicesFixture().INVOICE_GUILLAUME_2,
          fixtures.getInvoicesFixture().INVOICE_BENJAMIN_1,
        ]);
      });
    });
  });
};
