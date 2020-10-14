/**
 * Invoices fixtures are used by all common test
 */
class InvoicesFixture {
  /**
   * Init the fixtures
   * @param {Function} idGenerator Function to generate id
   * @param {String} [idFieldName='id'] Default name of the id field in every schema
   */
  constructor({ idGenerator, idFieldName = 'id', }) {
    this.ID = {
      CUSTOMERS: {
        GUILLAUME: idGenerator(),
        BENJAMIN: idGenerator(),
        FLORINE: idGenerator(),
      },
      INVOICES: {
        GUILLAUME_1: idGenerator(),
        GUILLAUME_2: idGenerator(),
        BENJAMIN_1: idGenerator(),
        FLORINE_1: idGenerator(),
      },
    };
    this.idGenerator = idGenerator;
    this.idFieldName = idFieldName;
  }

  /**
   * Get declaration for create model
   * @param {Object} ilorm Inject ilorm for creating schema
   * @returns {Object} Return object to init model with
   */
  getData(ilorm) {
    return {
      invoices: {
        name: 'invoices',
        schema: new ilorm.Schema(this.getInvoicesSchema(ilorm)),
        connector: this.getInvoicesConnector(),
      },
      customers: {
        name: 'customers',
        schema: new ilorm.Schema(this.getCustomersSchema(ilorm)),
        connector: this.getCustomersConnector(),
      },
      accounts: {
        name: 'accounts',
        schema: new ilorm.Schema(this.getAccountsSchema(ilorm)),
        connector: this.getAccountsConnector(),
      },
    };
  }

  /**
   * Inject ilorm and get schema associate with invoices
   * @param {Object} ilorm Inject ilorm for creating schema
   * @returns {Object} The schema
   */
  getInvoicesSchema(ilorm) {
    const { Schema, } = ilorm;

    return {
      id: Schema.string().primary(),
      customerId: Schema.string().reference({
        referencedModel: 'customers',
        referencedField: 'id',
      }),
      createdAt: Schema.date().default(() => Date.now()),
      paidAt: Schema.date(),
      isPaid: Schema.boolean().default(false),
      amount: Schema.number(),
    };
  }

  /**
   * Inject ilorm and get schema associate with customers
   * @param {Object} ilorm Inject ilorm for creating schema
   * @returns {Object} The schema
   */
  getCustomersSchema(ilorm) {
    const { Schema, } = ilorm;

    return {
      id: Schema.string().primary(),
      firstName: Schema.string(),
      lastName: Schema.string(),
    };
  }

  /**
   * Get schema of an account
   * @param {Object} ilorm Inject ilorm for creating schema
   * @returns {Object} The schema
   */
  getAccountsSchema(ilorm) {
    const { Schema, } = ilorm;

    return {
      customerId: Schema.string().primary()
        .reference({
          referencedModel: 'customers',
          referencedField: 'id',
        }),
      balance: Schema.number(),
    };
  }

  /**
   * Get connector associate with invoices
   * @returns {Connector} Need to be overload by connector
   */
  getInvoicesConnector() {
    throw new Error('Need to be overload for specific testing');
  }

  /**
   * Get connector associate with customers
   * @returns {Connector} Need to be overload by connector
   */
  getCustomersConnector() {
    throw new Error('Need to be overload for specific testing');
  }

  /**
   * Get connector associate with accounts
   * @returns {Connector} Need to be overload by connector
   */
  getAccountsConnector() {
    throw new Error('Need to be overload for specific testing');
  }

  /**
   * Get raw data of invoices to insert into database before test
   * @returns {Object} Data to insert into database
   */
  getInvoicesFixture() {
    return {
      INVOICE_GUILLAUME_1: {
        [this.idFieldName]: this.ID.INVOICES.GUILLAUME_1,
        customerId: this.ID.CUSTOMERS.GUILLAUME,
        createdAt: new Date('2019-01-01'),
        isPaid: false,
        paidAt: null,
        amount: 300,
      },
      INVOICE_GUILLAUME_2: {
        [this.idFieldName]: this.ID.INVOICES.GUILLAUME_2,
        customerId: this.ID.CUSTOMERS.GUILLAUME,
        createdAt: new Date('2019-02-05'),
        isPaid: false,
        paidAt: null,
        amount: 150,
      },
      INVOICE_BENJAMIN_1: {
        [this.idFieldName]: this.ID.INVOICES.BENJAMIN_1,
        customerId: this.ID.CUSTOMERS.BENJAMIN,
        createdAt: new Date('2017-01-01'),
        isPaid: false,
        paidAt: null,
        amount: 99,
      },
      INVOICE_FLORINE_1: {
        [this.idFieldName]: this.ID.INVOICES.FLORINE_1,
        customerId: this.ID.CUSTOMERS.FLORINE,
        createdAt: new Date('2020-11-12'),
        isPaid: false,
        paidAt: null,
        amount: 399,
      },
    };
  }

  /**
   * Get raw data of customers to insert into database before test
   * @returns {Object} Data to insert into database
   */
  getCustomersFixture() {
    return {
      GUILLAUME: {
        [this.idFieldName]: this.ID.CUSTOMERS.GUILLAUME,
        firstName: 'Guillaume',
        lastName: 'Daix',
      },
      BENJAMIN: {
        [this.idFieldName]: this.ID.CUSTOMERS.BENJAMIN,
        firstName: 'Benjamin',
        lastName: 'Daix',
      },
      FLORINE: {
        [this.idFieldName]: this.ID.CUSTOMERS.FLORINE,
        firstName: 'Florine',
        lastName: 'Jojo',
      },
    };
  }

  /**
   * Get raw data of customers to insert into database before test
   * @returns {Object} Data to insert into database
   */
  getAccountsFixture() {
    return {
      GUILLAUME: {
        customerId: this.ID.CUSTOMERS.GUILLAUME,
        balance: 300,
      },
      BENJAMIN: {
        customerId: this.ID.CUSTOMERS.BENJAMIN,
        balance: 0,
      },
      FLORINE: {
        customerId: this.ID.CUSTOMERS.FLORINE,
        balance: 1200,
      },
    };
  }

}

module.exports = InvoicesFixture;
