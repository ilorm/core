'use strict';

const { QUERY, FIELD, MODEL_ID, } = require('../../constants');
const { FIELDS, SELECT_BEHAVIOR, } = QUERY;
const { CONNECTOR, LIMIT, LINKED_WITH, MODEL, SELECT, SKIP, UPDATE, } = FIELDS;

const queryBuilderMethod = require('./queryBuilder.method');

const orMethod = require('./or.method');
const streamMethod = require('./stream.method');
const restrictToModelMethod = require('./restrictToModel.method');

/**
 * Instantiate the BaseQuery by injecting the ilorm instance
 * @param {Ilorm} ilorm Current ilorm context
 * @returns {BaseQuery} Return BaseQuery class
 */
const injectIlorm = (ilorm) => {
  /**
   * Class representing a queryBuilder
   * It's used by the framework to build query
   */
  class BaseQuery {
    /**
     * Init the query object
     * @param {Transaction} transaction bound with the query
     */
    constructor({ transaction = null, } = {}) {
      this[QUERY.FIELDS.SELF] = this;
      this[QUERY.FIELDS.SELF_PROXY] = new Proxy(this, {
        get: (target, property) => target.get(property),
      });
      this[QUERY.FIELDS.TRANSACTION] = transaction || ilorm.Transaction.getCurrentTransaction();
      if (this[QUERY.FIELDS.TRANSACTION]) {
        this[QUERY.FIELDS.TRANSACTION].bindModel({
          Model: this[QUERY.FIELDS.MODEL],
        });
      }

      return this[QUERY.FIELDS.SELF_PROXY];
    }

    /**
     * Trap for getting a property
     * @param {String} property The property to target in the query
     * @returns {QueryOperations} The operations to apply on the field
     */
    get(property) {
      if (this[property] || typeof property === 'symbol') {
        return this[property];
      }

      const propertyDefinition = this[QUERY.FIELDS.SCHEMA].definition[property];

      if (!propertyDefinition) {
        throw new Error(`The property ${property.toString()} does not exists in the defined schema.`);
      }

      return propertyDefinition.getQueryOperations({
        query: this[QUERY.FIELDS.SELF_PROXY],
      });
    }

    /**
     * Restrict query to the related model
     * @param {Model|Array.<Model>} relatedModel The related model instance to restrict the query
     * @returns {Query} Return the current query
     */
    restrictToModel(relatedModel) {
      return restrictToModelMethod(this, ilorm)(relatedModel);
    }

    /**
     * Declare field as linked with another query, model or ID.
     * @param {Model|Query} relatedElement Specify an element which be linked with the query result
     * @returns {Query} Return the query to make additional link or filters
     */
    linkedWith(relatedElement) {
      let query;

      // It's a Model Id
      if (relatedElement && relatedElement[MODEL_ID.ID]) {
        const relation = ilorm.Relation.getRelation({
          modelSource: this[QUERY.FIELDS.MODEL],
          modelReferenced: relatedElement[MODEL_ID.MODEL],
        });

        relation.applyToQuery({
          query: this,
          ids: relatedElement[MODEL_ID.ID],
        });

        return this;
      }

      // It's a Model instance
      if (relatedElement && relatedElement.save) {
        const relation = ilorm.Relation.getRelation({
          modelSource: this[QUERY.FIELDS.MODEL],
          modelReferenced: relatedElement.constructor,
        });

        relation.applyToQuery({
          query: this,
          ids: relatedElement.getPrimary(),
        });

        return this;
      }

      // It's a query:
      if (relatedElement && relatedElement[MODEL]) {
        query = relatedElement;
      }

      // It's a model:
      if (!query && relatedElement && relatedElement.getName) {
        return this.restrictToModel(relatedElement);
      }
      if (!query) {
        throw new Error('linkedWith parameter is not valid, need to be an instanceof Query or Model');
      }

      this[LINKED_WITH] = query;

      return this;
    }

    /**
     * Find one instance from the query
     * @returns {Model} Return an instance of the linked model
     */
    async findOne() {
      const rawResult = await this.runQuery('findOne');

      return this.applySelectBehaviorOnConnectorResult(rawResult);
    }

    /**
     * Find one or more instance
     * @returns {Array<Model>} Return an array of instance linked with the model
     */
    async find() {
      const rawResultList = await this.runQuery('find');

      return rawResultList.map((rawResult) => this.applySelectBehaviorOnConnectorResult(rawResult));
    }

    /**
     * Apply the primary key of the current query
     * @param {Mixed} primary The key to apply
     * @returns {Void} Return nothing
     */
    restrictToPrimary() {
      throw new Error('Required to be overload by connector query class');
    }

    /**
     * Convert raw result from connector find or findOne to instance or selected field
     * @param {Object} rawResult The raw result to convert
     * @returns {Object|null} The result in function of select behavior
     */
    applySelectBehaviorOnConnectorResult(rawResult) {
      // Without raw result, you return null to show the absence of value :
      if (!rawResult) {
        return null;
      }

      // Classic way, without select, you only instantiate the child model :
      if (this[SELECT].behavior === SELECT_BEHAVIOR.ALL) {
        return this[MODEL].instantiate(rawResult);
      }

      // queryField.selectOnly() will return only the field value :
      if (this[SELECT].behavior === SELECT_BEHAVIOR.ONE) {
        return rawResult[this[SELECT].fields[0].field[FIELD.NAME]];
      }

      // queryField.select() it's the connector work to choose the select field :
      return rawResult;
    }

    /**
     * Declare the number of element to skip (the query will ignore this element).
     * @param {Number} nbElementToSkip The number of element to skip
     * @returns {Query} Return the query to make additional link or filters
     */
    skip(nbElementToSkip) {
      this[SKIP] = nbElementToSkip;

      return this;
    }

    /**
     * Declare the number of element to query (the query will only returns this elements).
     * @param {Number} nbElementToQuery The number of element to get
     * @returns {Query} Return the query to make additional link or filters
     */
    limit(nbElementToQuery) {
      this[LIMIT] = nbElementToQuery;

      return this;
    }

    /**
     * Count instance which match the query
     * @returns {Promise.<Number>} The number of instance which match the query
     */
    count() {
      return this.runQuery('count');
    }

    /**
     * Remove instance which match the query
     * @returns {*} TODO
     */
    remove() {
      return this.runQuery('remove');
    }

    /**
     * Remove one instance which match the query
     * @returns {*} TODO
     */
    removeOne() {
      return this.runQuery('removeOne');
    }

    /**
     * Update one or more element which match the query, with the current update state
     * @returns {*} TODO
     */
    update() {
      return this.runUpdate('update');
    }

    /**
     * Update one element which match the query, with the current update state
     * @returns {*} TODO
     */
    updateOne() {
      return this.runUpdate('updateOne');
    }

    /**
     * Run specific query operation on the current query
     * @param {String} connectorOperation The operation to run
     * @returns {Promise.<*>} The result of the operation
     */
    async runQuery(connectorOperation) {
      await this.prepareQuery();

      if (this[LINKED_WITH]) {
        this.restrictToModel(await this[LINKED_WITH].find());
      }

      return this[CONNECTOR][connectorOperation](this);
    }

    /**
     * Run specific update operation on the current query
     * @param {String} connectorOperation The operation to run
     * @returns {Promise.<*>} The result of the operation
     */
    async runUpdate(connectorOperation) {
      await this.prepareQuery();
      await this.prepareUpdate();

      if (this[LINKED_WITH]) {
        this.restrictToModel(await this[LINKED_WITH].find());
      }

      return this[CONNECTOR][connectorOperation](this);
    }

    /**
     * Helper to convert ilorm query object to query on the Connector side
     * @param {Function} onOr This function will be called if the user have calling an or on this query
     * @param {Function} onOperator This function will be called per every key operator value combination
     * @param {Function} onOptions This function will be called to put skip and limit to the child query
     * @param {Function} onSelect This function will be called to handle select specific fields from the database
     * @returns {void} Return nothing
     */
    queryBuilder({ onOr, onOperator, onOptions, onSelect, onSort, }) {
      return queryBuilderMethod(this)({
        onOr,
        onOperator,
        onOptions,
        onSelect,
        onSort,
      });
    }

    /**
     * Helper to convert ilorm query object to query on the Connector side
     * @param {Function} onOperator This function will be called per every key operator value combination
     * @returns {void} Return nothing
     */
    updateBuilder({ onOperator, }) {
      if (onOperator) {
        for (const updateOperation of this[UPDATE]) {
          onOperator(updateOperation);
        }
      }
    }

    /**
     * Utility method called before each query, could be used to change query behavior
     * @returns {void} Return nothing, only change the internal state of query
     */
    async prepareQuery() {
    }

    /**
     * Utility method called before each update, could be used to change update behavior
     * @returns {void} Return nothing, only change the internal state of query
     */
    prepareUpdate() {
    }

    /**
     * Bind a transaction to the current query
     * @param {Transaction} transaction to bind the query with
     * @returns {BaseQuery} query to chain declaration
     */
    transaction(transaction) {
      this[QUERY.FIELDS.TRANSACTION] = transaction;
      this[QUERY.FIELDS.TRANSACTION].bindModel({
        Model: this[QUERY.FIELDS.MODEL],
      });

      return this;
    }

    /**
     * Declare or field
     * @param {Function} handler be called back with a branch parameter using to create new branch
     * @returns {Query} Return current query to chain call
     */
    or(handler) {
      return orMethod(this)(handler);
    }

    /**
     * Create a stream of data returned by the query on the database
     * @returns {Promise.<Stream>} A readable stream to manipulate resulting data
     */
    stream() {
      return streamMethod(this);
    }
  }

  return BaseQuery;
};

module.exports = injectIlorm;
