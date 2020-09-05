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
      },
      INVOICES: {
        GUILLAUME_1: idGenerator(),
      },
    };
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
    };
  }

  /**
   * Inject ilorm and get schema associate with invoices
   * @param {Object} ilorm Inject ilorm for creating schema
   * @returns {{raceId: (Field|*), gender: *, name: *, id: Field, weapons: *, height: (void|*)}} The schema
   */
  getInvoicesSchema(ilorm) {
    const { Schema, } = ilorm;

    return {
      id: Schema.string().primary(),
      customerId: Schema.string().reference({
        referencedModel: 'customers',
        referencedField: 'id',
      }),
      createdAt: Schema.date(),
      paidAt: Schema.date(),
      isPaid: Schema.boolean(),
      amount: Schema.number(),
    };
  }

  /**
   * Inject ilorm and get schema associate with customers
   * @param {Object} ilorm Inject ilorm for creating schema
   * @returns {{name: *, id: Field}} The schema
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
    };
  }

}

module.exports = InvoicesFixture;
