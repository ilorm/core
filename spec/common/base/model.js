const { expect, } = require('chai');

module.exports = (TestContext) => {
  const testContext = TestContext.getInvoices();


  describe('Model', () => {
    after(() => testContext.finalCleanUp());
    beforeEach(() => testContext.initDb());
    afterEach(() => testContext.cleanDb());

    it('Should define default field', () => {
      const Invoices = testContext.Models.invoices;

      const emptyInvoice = new Invoices();

      expect(emptyInvoice).to.deep.equal({
        id: null,
        customerId: null,
        createdAt: null,
        paidAt: null,
        isPaid: false,
        amount: null,
      });
    });
  });
};
