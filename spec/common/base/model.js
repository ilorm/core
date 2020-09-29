const { expect, } = require('chai');

const FAKE_DATE = 3232323232;
const dateNow = Date.now;

module.exports = (TestContext) => {
  const testContext = TestContext.getInvoices();


  describe('Model', () => {
    after(() => testContext.finalCleanUp());
    beforeEach(() => testContext.initDb());
    afterEach(async () => {
      await testContext.cleanDb();

      Date.now = dateNow;
    });

    it('Should define default field', () => {
      Date.now = () => FAKE_DATE;

      const Invoices = testContext.Models.invoices;

      const emptyInvoice = new Invoices();

      expect(emptyInvoice).to.deep.equal({
        id: null,
        customerId: null,
        createdAt: FAKE_DATE,
        paidAt: null,
        isPaid: false,
        amount: null,
      });
    });
  });
};
