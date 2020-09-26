const { expect, } = require('chai');

module.exports = (TestContext) => {
  const testContext = TestContext.getInvoices();


  describe('ModelId', () => {
    after(() => testContext.finalCleanUp());
    beforeEach(() => testContext.initDb());
    afterEach(() => testContext.cleanDb());

    it('Should instantiate id from direct id or by field', () => {
      const Customers = testContext.Models.customers;

      const CUSTOMER_ID_A = Customers.id(testContext.fixtures.ID.CUSTOMERS.GUILLAUME);
      const CUSTOMER_ID_B = Customers.id({
        [testContext.fixtures.idFieldName]: testContext.fixtures.ID.CUSTOMERS.GUILLAUME,
      });

      expect(CUSTOMER_ID_A).to.deep.equal(CUSTOMER_ID_B);
    });

    it('Should resolve instance from id', async () => {
      const Customers = testContext.Models.customers;

      const CUSTOMER_ID = Customers.id(testContext.fixtures.ID.CUSTOMERS.GUILLAUME);

      const customer = await CUSTOMER_ID.resolveInstance();

      expect(customer).to.deep.equal(testContext.fixtures.getCustomersFixture().GUILLAUME);
    });
  });
};
