const { expect, } = require('chai');

module.exports = (TestContext) => {
  const testContext = TestContext.getInvoices();
  const { fixtures, } = testContext;

  describe('query.linkedWith', () => {

    describe('operations', () => {
      beforeEach(() => testContext.initDb());
      afterEach(() => testContext.cleanDb());
      after(() => testContext.finalCleanUp());

      it('Should work with count', async () => {
        const Invoices = testContext.Models.invoices;
        const Customers = testContext.Models.customers;

        const totalInvoices = await Invoices.query()
          .linkedWith(
            Customers.query()
              .lastName.is('Daix')
          )
          .count();

        // eslint-disable-next-line no-magic-numbers
        expect(totalInvoices).to.equal(3);
      });

      it('Should work with findOne', async () => {
        const Invoices = testContext.Models.invoices;
        const Customers = testContext.Models.customers;

        const invoice = await Invoices.query()
          .linkedWith(
            Customers.query()
              .lastName.is('Daix')
          )
          .findOne();

        expect(invoice).to.deep.equal(fixtures.getInvoicesFixture().INVOICE_GUILLAUME_1);
      });

      it('Should work with update', async () => {
        const Invoices = testContext.Models.invoices;
        const Customers = testContext.Models.customers;

        await Invoices.query()
          .linkedWith(
            Customers.query()
              .lastName.is('Daix')
          )
          // eslint-disable-next-line no-magic-numbers
          .amount.set(500)
          .update();

        const totalInvoices = await Invoices.query()
          .linkedWith(
            Customers.query()
              .lastName.is('Daix')
          )
          // eslint-disable-next-line no-magic-numbers
          .amount.is(500)
          .count();

        // eslint-disable-next-line no-magic-numbers
        expect(totalInvoices).to.equal(3);
      });

      it('Should work with updateOne', async () => {
        const Invoices = testContext.Models.invoices;
        const Customers = testContext.Models.customers;

        await Invoices.query()
          .linkedWith(
            Customers.query()
              .lastName.is('Daix')
          )
          // eslint-disable-next-line no-magic-numbers
          .amount.set(500)
          .updateOne();

        const totalInvoices = await Invoices.query()
          .linkedWith(
            Customers.query()
              .lastName.is('Daix')
          )
          // eslint-disable-next-line no-magic-numbers
          .amount.is(500)
          .count();

        // eslint-disable-next-line no-magic-numbers
        expect(totalInvoices).to.equal(1);
      });

      it('Should work with remove', async () => {
        const Invoices = testContext.Models.invoices;
        const Customers = testContext.Models.customers;

        await Invoices.query()
          .linkedWith(
            Customers.query()
              .lastName.is('Daix')
          )
          .remove();

        const totalInvoices = await Invoices.query()
          .linkedWith(
            Customers.query()
              .lastName.is('Daix')
          )
          .count();

        expect(totalInvoices).to.equal(0);
      });

      it('Should work with removeOne', async () => {
        const Invoices = testContext.Models.invoices;
        const Customers = testContext.Models.customers;

        await Invoices.query()
          .linkedWith(
            Customers.query()
              .lastName.is('Daix')
          )
          .removeOne();

        const totalInvoices = await Invoices.query()
          .linkedWith(
            Customers.query()
              .lastName.is('Daix')
          )
          .count();

        // eslint-disable-next-line no-magic-numbers
        expect(totalInvoices).to.equal(2);
      });

      it('Should work with stream', async () => {
        const Invoices = testContext.Models.invoices;
        const Customers = testContext.Models.customers;

        const invoicesStream = await Invoices.query()
          .linkedWith(
            Customers.query()
              .lastName.is('Daix')
          )
          .stream();

        const result = [];

        invoicesStream.on('data', (invoice) => result.push(invoice));

        await new Promise((resolve, reject) => {
          invoicesStream.on('close', resolve);
          invoicesStream.on('end', resolve);
          invoicesStream.on('error', reject);
        });

        expect(result).to.deep.members([
          fixtures.getInvoicesFixture().INVOICE_GUILLAUME_1,
          fixtures.getInvoicesFixture().INVOICE_GUILLAUME_2,
          fixtures.getInvoicesFixture().INVOICE_BENJAMIN_1,
        ]);
      });
    });
  });
};
