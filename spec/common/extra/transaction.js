const { expect, } = require('chai');

const ENFORCE_INIT_SECOND = 5;
const CONCURRENCY_RISK_TTL = 25;

// eslint-disable-next-line require-jsdoc
function sleep(ttl) {
  return new Promise((resolve) => setTimeout(resolve, ttl));
}

module.exports = (TestContext) => {
  const testContext = TestContext.getInvoices();

  describe('Transaction', () => {
    describe('Transaction system should enforce order of operation', () => {
      after(() => testContext.finalCleanUp());
      beforeEach(() => testContext.initDb());
      afterEach(() => testContext.cleanDb());


      it('Syntax Transaction.run(() => {', async () => {

        // eslint-disable-next-line global-require
        const { AsyncLocalStorage, } = require('async_hooks');

        // Check if async local storage is available;
        if (AsyncLocalStorage) {
          const Invoices = testContext.Models.invoices;
          const Accounts = testContext.Models.accounts;
          const { Transaction, } = testContext.ilorm;

          // eslint-disable-next-line require-jsdoc,no-inner-declarations
          async function paidInvoice(waitTime) {
            let invoicePaid = false;

            await Transaction.run(async () => {
              const invoice = await Invoices.query()
                .id.is(testContext.fixtures.ID.INVOICES.GUILLAUME_1)
                .findOne();

              // Wait during waitTime during the transaction to create concurrency issue;
              await sleep(waitTime);

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
            paidInvoice(CONCURRENCY_RISK_TTL),
            (async () => {
              // enforce the the first paid invoice have reach lock process before start;
              await sleep(ENFORCE_INIT_SECOND);

              return paidInvoice(0);
            })(),
          ])).to.deep.equal([ true, false, ]);
        }
      });


      it('Syntax Transaction.run((transaction) => {', async () => {
        const Invoices = testContext.Models.invoices;
        const Accounts = testContext.Models.accounts;
        const { Transaction, } = testContext.ilorm;

        // eslint-disable-next-line require-jsdoc
        async function paidInvoice(waitTime) {
          let invoicePaid = false;

          await Transaction.run(async ({ transaction, }) => {
            const invoice = await Invoices.query()
              .transaction(transaction)
              .id.is(testContext.fixtures.ID.INVOICES.GUILLAUME_1)
              .findOne();

            // Wait during waitTime during the transaction to create concurrency issue;
            await sleep(waitTime);

            const userAccount = await Accounts.query()
              .transaction(transaction)
              .customerId.is(invoice.customerId)
              .findOne();

            if (userAccount.balance >= invoice.amount && !invoice.isPaid) {
              invoice.isPaid = true;
              userAccount.balance -= invoice.amount;

              await Promise.all([
                invoice.save({ transaction, }),
                userAccount.save({ transaction, }),
              ]);

              invoicePaid = true;
            }
          });

          return invoicePaid;
        }

        // First time we try to paid the invoice; it will work;
        expect(await Promise.all([
          paidInvoice(CONCURRENCY_RISK_TTL),
          (async () => {
            // enforce the the first paid invoice have reach lock process before start;
            await sleep(ENFORCE_INIT_SECOND);

            return paidInvoice(0);
          })(),
        ])).to.deep.equal([ true, false, ]);
      });


      it('Syntax const transaction = new Transaction()', async () => {
        const Invoices = testContext.Models.invoices;
        const Accounts = testContext.Models.accounts;
        const { Transaction, } = testContext.ilorm;

        // eslint-disable-next-line require-jsdoc
        async function paidInvoice(waitTime) {
          let invoicePaid = false;

          const transaction = new Transaction();

          const invoice = await Invoices.query()
            .transaction(transaction)
            .id.is(testContext.fixtures.ID.INVOICES.GUILLAUME_1)
            .findOne();

          // Wait during waitTime during the transaction to create concurrency issue;
          await sleep(waitTime);

          const userAccount = await Accounts.query()
            .transaction(transaction)
            .customerId.is(invoice.customerId)
            .findOne();

          if (userAccount.balance >= invoice.amount && !invoice.isPaid) {
            invoice.isPaid = true;
            userAccount.balance -= invoice.amount;

            await Promise.all([
              invoice.save({ transaction, }),
              userAccount.save({ transaction, }),
            ]);


            invoicePaid = true;
          }

          await transaction.commit();

          return invoicePaid;
        }

        // First time we try to paid the invoice; it will work;
        expect(await Promise.all([
          paidInvoice(CONCURRENCY_RISK_TTL),
          (async () => {
            // enforce the the first paid invoice have reach lock process before start;
            await sleep(ENFORCE_INIT_SECOND);

            return paidInvoice(0);
          })(),
        ])).to.deep.equal([ true, false, ]);
      });
    });
  });
};
