const { expect, } = require('chai');

const CONCURENCY_RISK_TTL = 5;

module.exports = (TestContext) => {
  const testContext = TestContext.getInvoices();

  describe('Transaction', () => {
    after(() => testContext.finalCleanUp());
    beforeEach(() => testContext.initDb());
    afterEach(() => testContext.cleanDb());

    it('Transaction system should enforce order of operation', async () => {
      const Invoices = testContext.Models.invoices;
      const Accounts = testContext.Models.accounts;
      const { Transaction, } = testContext.ilorm;

      // eslint-disable-next-line require-jsdoc
      async function paidInvoice(waitTime) {
        let invoicePaid = false;

        await Transaction.run(async () => {
          const invoice = await Invoices.query()
            .id.is(testContext.fixtures.ID.INVOICES.GUILLAUME_1)
            .findOne();

          // Wait during waitTime during the transaction to create concurrency issue;
          await new Promise(((resolve) => setTimeout(resolve, waitTime)));

          const userAccount = await Accounts.query()
            .customerId.is(invoice.customerId)
            .findOne();

          if (userAccount.balance >= invoice.amount && !invoice.isPaid) {
            invoice.isPaid = true;
            userAccount.balance -= invoice.amount;

            await Promise.all([
              invoice.save(),
              userAccount.save(),
            ]);

            invoicePaid = true;
          }
        });

        return invoicePaid;
      }

      // First time we try to paid the invoice; it will work;
      expect(await Promise.all([
        paidInvoice(CONCURENCY_RISK_TTL),
        paidInvoice(0),
      ])).to.deep.equal([ true, false, ]);
    });
  });
};
