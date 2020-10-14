const { expect, } = require('chai');

const FAKE_DATE = new Date('2020-10-01');
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
        [testContext.fixtures.idFieldName]: null,
        customerId: null,
        createdAt: FAKE_DATE,
        paidAt: null,
        isPaid: false,
        amount: null,
      });
    });

    it('Delete a property should reset the value to null', async () => {
      const Invoices = testContext.Models.invoices;

      const ilormInvoice = await Invoices.query()
        // eslint-disable-next-line no-unexpected-multiline
        [testContext.fixtures.idFieldName].is(testContext.fixtures.ID.INVOICES.BENJAMIN_1)
        .findOne();

      expect(ilormInvoice.customerId).to.be.deep.equal(testContext.fixtures.ID.CUSTOMERS.BENJAMIN);

      delete ilormInvoice.customerId;

      expect(ilormInvoice.customerId).to.be.equal(null);
    });

    it('Should insert model into database', async () => {
      Date.now = () => FAKE_DATE;

      const Invoices = testContext.Models.invoices;

      const invoiceToSave = new Invoices();

      const INSERT_ID = testContext.fixtures.idGenerator();

      invoiceToSave[testContext.fixtures.idFieldName] = INSERT_ID;
      invoiceToSave.customerId = testContext.fixtures.ID.CUSTOMERS.BENJAMIN;
      invoiceToSave.amount = 300;

      await invoiceToSave.save();

      const invoice = await Invoices.query()
        // eslint-disable-next-line no-unexpected-multiline
        [testContext.fixtures.idFieldName].is(INSERT_ID)
        .findOne();

      expect(invoice).to.deep.equal({
        [testContext.fixtures.idFieldName]: INSERT_ID,
        customerId: testContext.fixtures.ID.CUSTOMERS.BENJAMIN,
        createdAt: FAKE_DATE,
        paidAt: null,
        isPaid: false,
        amount: 300,
      });
    });

    it('Should remove instance from the database', async () => {
      const Invoices = testContext.Models.invoices;

      const ilormInvoice = await Invoices.query()
        // eslint-disable-next-line no-unexpected-multiline
        [testContext.fixtures.idFieldName].is(testContext.fixtures.ID.INVOICES.BENJAMIN_1)
        .findOne();

      await ilormInvoice.remove();

      const exists = await Invoices.query()
        // eslint-disable-next-line no-unexpected-multiline
        [testContext.fixtures.idFieldName].is(testContext.fixtures.ID.INVOICES.BENJAMIN_1)
        .findOne();

      expect(exists).to.be.equal(null);
    });

    it('Model.getJSON return a copy of the object as a non Ilorm Model', async () => {
      const Invoices = testContext.Models.invoices;

      const ilormInvoice = await Invoices.query()
        // eslint-disable-next-line no-unexpected-multiline
        [testContext.fixtures.idFieldName].is(testContext.fixtures.ID.INVOICES.BENJAMIN_1)
        .findOne();

      const jsonInvoice = ilormInvoice.getJson();

      expect(jsonInvoice).to.deep.equal(ilormInvoice);
      expect(jsonInvoice).to.not.be.an.instanceof(Invoices);
      expect(ilormInvoice).to.be.an.instanceof(Invoices);

    });
  });
};
