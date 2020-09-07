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
      const { Transaction, } = testContext.ilorm;

      // eslint-disable-next-line require-jsdoc
      async function paidInvoice(waitTime) {
        let invoicePaid = false;

        await Transaction.run(() => {

          // Create a risk of concurency;
          setTimeout(async () => {
            const result = await Invoices.query()
              .isPaid.set(true)
              .isPaid.is(false)
              // eslint-disable-next-line no-unexpected-multiline
              [testContext.idFieldName].is(testContext.ID.INVOICES.GUILLAUME_1)
              .updateOne();

            invoicePaid = result.nbUpdated;
          }, waitTime);
        });

        return invoicePaid;
      }

      // First time we try to paid the invoice; it will work;
      expect(await paidInvoice(CONCURENCY_RISK_TTL)).to.equal(true);

      // The second time the invoice is already paid;
      expect(await paidInvoice(0)).to.equal(false);
    });
  });
};
