const { expect, } = require('chai');

module.exports = (TestContext) => {
  const testContext = TestContext.getInvoices();
  const { fixtures, } = testContext;

  describe('query.linkedWith', () => {

    describe('multiple linkedWith', () => {
      beforeEach(() => testContext.initDb());
      afterEach(() => testContext.cleanDb());
      after(() => testContext.finalCleanUp());

      it('Should work with two linkedWith working with sub query', async () => {
        const Invoices = testContext.Models.invoices;
        const Accounts = testContext.Models.accounts;
        const Customers = testContext.Models.customers;

        const customers = await Customers.query()
          .linkedWith(
            Accounts.query()
              .balance.is(0)
          )
          .linkedWith(
            Invoices.query()
              .isPaid.is(false)
          )
          .find();

        expect(customers).to.deep.members([ fixtures.getCustomersFixture().BENJAMIN, ]);
      });

    });
  });
};
