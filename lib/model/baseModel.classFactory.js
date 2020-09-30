'use strict';

const MainStream = require('./main.stream');
const { queryFactory, } = require('../query');
const { FIELD, MODEL, } = require('../constants');

const {
  IS_NEW,
  LIST_UPDATED_FIELDS,
  MODEL_ID_CLASS,
} = MODEL;

/**
 * Inject ilorm to the class to bind current ilorm with BaseModel
 * @param {Ilorm} ilorm The ilorm context
 * @returns {BaseModel} Return the baseModel to use
 */
const injectIlorm = (ilorm) => {
  /**
   * Class representing a Model
   */
  class BaseModel {
    /**
     * Construct a new instance of the model
     * @param {Object} [rawInstance={}] object to use as initial data of the model instance
     */
    constructor(rawInstance = {}) {
      Object.defineProperties(this, {
        [IS_NEW]: {
          value: true,
          writable: true,
        },
        [LIST_UPDATED_FIELDS]: {
          value: [],
          writable: true,
        },
      });

      this.constructor.getSchema().initInstance(this);

      const instance = new Proxy(this, {
        get: (instance, property) => instance.get(property),
        set: (instance, property, value) => instance.set(property, value),
        deleteProperty: (instance, property) => instance.deleteProperty(property),
      });

      for (const property of Object.keys(rawInstance)) {
        instance[property] = rawInstance[property];
      }

      this[LIST_UPDATED_FIELDS] = [];

      return instance;
    }

    /**
     * Instantiate a ModelId bound with the given id
     * @param {Mixed} id The id, need to be a primary key linked with a model instance
     * @returns {ModelId} Return a modelId instance
     */
    static id(id) {
      return new this[MODEL_ID_CLASS](id);
    }

    /**
     * Get a duplex stream linked with the model
     * Could be use to write data from a stream into the linked database
     * Could be use to read all data from the linked database
     * @return {DuplexStream} The duplexstream to use
     */
    static stream() {
      return new MainStream({
        Model: this,
      });
    }

    /**
     * Return the schema associated with the current model
     * @param {Schema} schema the schema returned by the function
     * @return {Schema} the schema associate with the model
     */
    static getSchema() {
      throw new Error('Missing Schema binding with the Model');
    }

    /**
     * Return the unique name of the model
     * @return {String} The model name
     */
    static getName() {
      throw new Error('Missing Name binding with the Model');
    }

    /**
     * Get the connector associate with the model
     * @return {Connector} The connector associate with the current model
     */
    static getConnector() {
      throw new Error('Missing connector binding with the Model');
    }

    /**
     * Get the connector associate with the model
     * @return {Object} The plugins options associate with the current model
     */
    static getPluginsOptions() {
      throw new Error('Missing plugins options binding with the Model');
    }

    /**
     * Instantiate a raw json object to an instance representing the data model
     * @param {Object} rawObject the raw object to instantiate
     * @Returns {Model} The model instance
     */
    static instantiate(rawObject = {}) {
      const Class = ilorm.modelsIndex.get(this.getName());

      const instance = new Class(rawObject);

      instance[IS_NEW] = false;

      return instance;
    }

    /**
     * Get the instance of the model linked with the given id
     * @param {ID} id The id of the target model
     * @return {Model} A model instance
     */
    static async getById(id) {
      const rawInstance = await this.getConnector().getById(id);

      return this.instantiate(rawInstance);
    }

    /**
     * Create a query targeting the model
     * @return {Query} return the query binded with the model
     */
    static query() {
      const Query = queryFactory({
        ilorm,
        model: ilorm.modelsIndex.get(this.getName()),
      });

      return new Query();
    }

    /**
     * Remove the current instance from the database
     * @param {Transaction} [transaction=null] Bind the remove with a transaction
     * @return {null} null
     */
    remove({ transaction = null, } = {}) {
      if (this[IS_NEW]) {
        // Simulate async behavior (remove is async) :
        return Promise.reject(new Error('Can not remove an unsaved instance'));
      }

      const query = this.getQueryPrimary();

      if (transaction) {
        query.transaction(transaction);
      }

      return this.constructor.getConnector().removeOne(query);
    }

    /**
     * Save the current instance in db
     * @param {Transaction} [transaction=null] Bind the save with a transaction
     * @return {null} null
     */
    async save({ transaction = null, } = {}) {
      // If it's a new instance, save it into database:
      if (this[IS_NEW]) {
        await this.constructor.getConnector().create({
          transaction,
          items: this,
        });

        this[IS_NEW] = false;
        this[LIST_UPDATED_FIELDS] = [];

        return this;
      }

      // Check if nothing require an update:
      if (this[LIST_UPDATED_FIELDS].length === 0) {
        return this;
      }

      // If something need to be updated:
      const query = this.getQueryPrimary();

      if (transaction) {
        query.transaction(transaction);
      }

      this[LIST_UPDATED_FIELDS].forEach((field) => {
        query[field].set(this[field]);
      });

      await this.constructor.getConnector().updateOne(query);

      this[LIST_UPDATED_FIELDS] = [];

      return this;
    }

    /**
     * Generate a query targeting the primary key of the instance
     * @returns {Object} Return the query to use to target the current instance
     */
    getQueryPrimary() {
      const primaryKeys = this.constructor.getSchema().getPrimaryKeys();

      if (primaryKeys.length === 0) {
        throw new Error('No field declare as primary() in the schema, can not use getQueryPrimary');
      }

      const query = this.constructor.query();

      for (const key of primaryKeys) {
        query[key[FIELD.NAME]].is(this[key[FIELD.NAME]]);
      }

      return query;
    }

    /**
     * Generate an object including all primary key of the given instance
     * @returns {Object} Return object with all primary key(s)
     */
    getPrimary() {
      const primaryKeys = this.constructor.getSchema().getPrimaryKeys();

      if (primaryKeys.length === 0) {
        throw new Error('No field declare as primary() in the schema, can not use getQueryPrimary');
      }

      return primaryKeys.reduce((acc, key) => ({
        ...acc,
        [key[FIELD.NAME]]: this[key[FIELD.NAME]],
      }), {});
    }

    /**
     * Return json associated with the current instance
     * @return {Object} The json associated with the instance
     */
    getJson() {
      const schema = this.constructor.getSchema();

      return schema.initInstance(this);
    }

    /**
     * Traps handler for get a property
     * When you try to get a property on an Ilorm model this method will be called
     * @param {*} property The property of the model to get
     * @return {*} Return the value of the model property
     */
    get(property) {
      return this[property];
    }

    /**
     * Traps handler for set a property
     * When you try to set the value of property on an Ilorm Model this method will be called.
     * @param {*} property The property of the model to set
     * @param {*} value The value you want to associate
     * @return {Boolean} Return true if the assignment was a success, false if not
     */
    set(property, value) {
      // Use to remember which field as been update (case of a loaded instance), use after to update it at save ;
      if (typeof property !== 'symbol') {
        this[LIST_UPDATED_FIELDS].push(property);

        // If property is in the schema, cast it before setting it;
        if (this.constructor.getSchema().definition[property]) {
          this[property] = this.constructor.getSchema().definition[property].castValue(value);

          return true;
        }
      }

      // Basic trap behavior when you set a property to an instance:
      this[property] = value;

      return true;
    }


    /**
     * Traps handler for delete a property
     * When you try to delete a property on an Ilorm model this method will be called
     * @param {*} property The property of the model to delete
     * @return {*} Return the value of the model property
     */
    deleteProperty(property) {
      delete this[property];

      return true;
    }
  }

  return BaseModel;
};

module.exports = injectIlorm;
