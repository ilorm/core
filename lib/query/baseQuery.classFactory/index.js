'use strict';

const { QUERY, FIELD, MODEL_ID, } = require('../../constants');
const { FIELDS, SELECT_BEHAVIOR, } = QUERY;
const { CONNECTOR, LIMIT, LINKED_WITH, MODEL, SELECT, SKIP, UPDATE, } = FIELDS;
const { QueryError, UnsupportedFeatureError, } = require('../../errors');

const queryBuilderMethod = require('./queryBuilder.method');
const orMethod = require('./or.method');
const streamMethod = require('./stream.method');

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
      this[LINKED_WITH] = [];

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
        throw new QueryError(`The property ${property.toString()} does not exists in the defined schema.`);
      }

      return propertyDefinition.getQueryOperations({
        query: this[QUERY.FIELDS.SELF_PROXY],
      });
    }

    /**
     * Declare field as linked with another query, model or ID.
     * @param {Model|Query} relatedElement Specify an element which be linked with the query result
     * @returns {Query} Return the query to make additional link or filters
     */
    linkedWith(relatedElement) {
      // It's a Model Id
      if (relatedElement && relatedElement[MODEL_ID.ID]) {
        const relation = ilorm.Relation.getRelation({
          modelSource: this[QUERY.FIELDS.MODEL],
          modelReferenced: relatedElement[MODEL_ID.MODEL],
        });

        relation.applyToQuery({
          query: this,
          modelLinked: relatedElement[MODEL_ID.ID],
        });

        return this;
      }

      // It's a query:
      if (relatedElement && relatedElement[MODEL]) {
        this[LINKED_WITH].push(relatedElement);

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
          modelLinked: relatedElement,
        });

        return this;
      }

      throw new QueryError(`linkedWith method called with a bad parameter (${relatedElement}).`);
    }

    /**
     * Apply the primary key of the current query
     * @param {Mixed} primary The key to apply
     * @returns {Void} Return nothing
     */
    restrictToPrimary() {
      throw new UnsupportedFeatureError('Required to be overload by connector query class');
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
     * Find one instance from the query
     * @returns {Model} Return an instance of the linked model
     */
    async findOne() {
      if (!this[LINKED_WITH].length) {
        const rawResult = await this[CONNECTOR].findOne(this);

        return this.applySelectBehaviorOnConnectorResult(rawResult);
      }

      let elementFound = null;

      await this.runComplexQuery(async () => {
        elementFound = await this[CONNECTOR].findOne(this);

        return !elementFound;
      });

      return this.applySelectBehaviorOnConnectorResult(elementFound);
    }

    /**
     * Find one or more instance
     * @returns {Array<Model>} Return an array of instance linked with the model
     */
    async find() {
      if (!this[LINKED_WITH].length) {
        const rawResultList = await this[CONNECTOR].find(this);

        return rawResultList.map((rawResult) => this.applySelectBehaviorOnConnectorResult(rawResult));
      }

      let results = [];

      const ids = new Set();

      await this.runComplexQuery(async () => {
        const partialResults = (await this[CONNECTOR].find(this))
          .map((rawResult) => this.applySelectBehaviorOnConnectorResult(rawResult));

        results = results.concat(partialResults.filter((result) => !ids.has(result.getLinearPrimary())));

        partialResults.forEach((result) => ids.add(result.getLinearPrimary()));

        return true;
      });

      return results;
    }

    /**
     * Count instance which match the query
     * @returns {Promise.<Number>} The number of instance which match the query
     */
    async count() {
      if (!this[LINKED_WITH].length) {
        return this[CONNECTOR].count(this);
      }

      let total = 0;

      await this.runComplexQuery(async () => {
        total += await this[CONNECTOR].count(this);

        return true;
      });

      return total;
    }

    /**
     * Remove instance which match the query
     * @returns {*} TODO
     */
    async remove() {
      if (!this[LINKED_WITH].length) {
        return this[CONNECTOR].remove(this);
      }

      let elementDeleted = 0;

      await this.runComplexQuery(async () => {
        elementDeleted += await this[CONNECTOR].remove(this);

        return true;
      });

      return elementDeleted;
    }

    /**
     * Remove one instance which match the query
     * @returns {*} TODO
     */
    async removeOne() {
      if (!this[LINKED_WITH].length) {
        return this[CONNECTOR].removeOne(this);
      }

      let elementDeleted = 0;

      await this.runComplexQuery(async () => {
        elementDeleted = await this[CONNECTOR].removeOne(this);

        return !elementDeleted;
      });

      return elementDeleted;
    }

    /**
     * Update one or more element which match the query, with the current update state
     * @returns {*} TODO
     */
    async update() {
      if (!this[LINKED_WITH].length) {
        return this[CONNECTOR].update(this);
      }

      let elementUpdated = 0;

      await this.runComplexQuery(async () => {
        elementUpdated += await this[CONNECTOR].update(this);

        return true;
      });

      return elementUpdated;
    }

    /**
     * Update one element which match the query, with the current update state
     * @returns {*} TODO
     */
    async updateOne() {
      if (!this[LINKED_WITH].length) {
        return this[CONNECTOR].updateOne(this);
      }

      let elementUpdated = 0;

      await this.runComplexQuery(async () => {
        elementUpdated = await this[CONNECTOR].updateOne(this);

        return !elementUpdated;
      });

      return elementUpdated;
    }

    /**
     * Run a complex query (with linkedWith)
     * @param {Function} accumulator Accumulator function return false to interrupt the complex query
     * @returns {Promise.<*>} The result of the operation
     */
    async runComplexQuery(accumulator) {
      const streams = this[LINKED_WITH].map((subQuery) => ({
        subQuery,
        stream: null,
        instance: null,
      }));
      const baseLength = this[QUERY.FIELDS.QUERY].length;
      let streamIndex = 1;

      let streamReadyResolve;
      const waitForStream = new Promise((resolve) => {
        streamReadyResolve = resolve;
      });

      streams[0].stream = await streams[0].subQuery.stream();
      streams[0].stream.on('readable', streamReadyResolve);

      await waitForStream;

      streams[0].instance = streams[0].stream.read();

      while (streams[0].instance !== null) {
        while (streamIndex < streams.length) {
          // eslint-disable-next-line no-await-in-loop
          streams[streamIndex].stream = await streams[streamIndex].subQuery.stream();

          let streamReadyResolve;
          const waitForStream = new Promise((resolve) => {
            streamReadyResolve = resolve;
          });

          streams[streamIndex].stream.on('readable', streamReadyResolve);

          // eslint-disable-next-line no-await-in-loop
          await waitForStream;

          streams[streamIndex].instance = streams[streamIndex].stream.read();

          streamIndex++;
        }
        for (let index = 0; index < streams.length; index++) {
          this.linkedWith(streams[index].instance);
        }

        // eslint-disable-next-line no-await-in-loop
        if (!await accumulator()) {
          break;
        }

        this[QUERY.FIELDS.QUERY].splice(baseLength);
        let nextStream = false;

        do {
          // eslint-disable-next-line no-await-in-loop
          streams[streamIndex - 1].instance = await streams[streamIndex - 1].stream.read();

          if (!streams[streamIndex - 1].instance) {
            streams[streamIndex - 1].stream.destroy();

            nextStream = true;

            streamIndex--;
          }
        } while (streamIndex > 0 && nextStream);
      }
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
