'use strict';

const { QUERY, SCHEMA_FIELD, } = require('ilorm-constants');
const { OPERATIONS, FIELDS, } = QUERY;
const { NAME, IS_REQUIRED, DEFAULT, } = SCHEMA_FIELD;
const declareOperation = require('./helpers/declareOperation');
const declareSelect = require('./helpers/declareSelect');
const declareSort = require('./helpers/declareSort');

const SCHEMA_FIELDS_OPERATIONS = [
  OPERATIONS.IS,
  OPERATIONS.IS_NOT,
  OPERATIONS.IS_IN,
  OPERATIONS.IS_NOT_IN,
];

/**
 * Class representing a field of the schema
 */
class BaseSchemaField {

  /**
   * Create a new Schema field
   */
  constructor() {
    this[IS_REQUIRED] = false;
    this[DEFAULT] = undefined;
    this[NAME] = null;
  }

  /**
   * Check if the given value is valid for the given field
   * @param {*} value The value to check
   * @return {boolean} Return true if the given value is valid of the current field
   */
  async isValid(value) { // eslint-disable-line
    if (this[IS_REQUIRED] && (value === null || value === undefined)) {
      return false;
    }

    return true;
  }

  /**
   * Init the given instance field
   * @param {Object} instance instance to init
   * @param {String} field field to init
   * @return {*} The initied field value
   */
  async init(instance, field) {
    const value = instance[field];

    if (value !== undefined) {
      if (!await this.isValid(value)) {
        throw new Error(`Invalid ${value} for field ${this[NAME]}`);
      }

      return value;
    }

    if (!this[DEFAULT]) {
      return undefined;
    }

    if (typeof this[DEFAULT] === 'function') {
      instance[field] = await this[DEFAULT]();

      return instance[field];
    }

    instance[field] = this[DEFAULT];

    return instance[field];
  }

  /**
   * Declare the field as required
   * @param {boolean} [isRequired=true] define the field as required or not
   * @return {SchemaField} Return the field (to chainable definition)
   */
  required(isRequired = true) {
    this[IS_REQUIRED] = isRequired;

    return this;
  }

  /**
   * Calling at schema binding with model.
   * Could be use to implement specific link between Model class and SchemaField.
   * @returns {Void} Return nothing
   */
  bindWithModel() {}

  /**
   * Set the default value of the field
   * @param {*} value The default value
   * @return {SchemaField} Return the field (to chainable definition)
   */
  default(value) {
    this[DEFAULT] = value;

    return this;
  }

  /**
   * Return the query operation associated with the given schema field
   * @param {Query} query the instance of query to use
   * @param {Array.<String>} additionalOperations Add operations to the field builder
   * @return {Object} The query operations
   */
  getQueryOperations({ query, name, additionalOperations = [], }) {
    const resultQueryOperations = {
      [OPERATIONS.SET]: declareOperation({
        query,
        operation: OPERATIONS.SET,
        field: FIELDS.UPDATE,
        key: name || this.name,
      }),
      [OPERATIONS.SELECT]: declareSelect({
        query,
        operation: OPERATIONS.SELECT,
        key: name || this.name,
      }),
      [OPERATIONS.SELECT_ONLY]: declareSelect({
        query,
        operation: OPERATIONS.SELECT_ONLY,
        key: name || this.name,
      }),
      [OPERATIONS.SORT_ASCENDING]: declareSort({
        query,
        operation: OPERATIONS.SORT_ASCENDING,
        key: name || this.name,
      }),
      [OPERATIONS.SORT_DESCENDING]: declareSort({
        query,
        operation: OPERATIONS.SORT_DESCENDING,
        key: name || this.name,
      }),
    };

    SCHEMA_FIELDS_OPERATIONS
      .concat(additionalOperations)
      .forEach(operation => {
        resultQueryOperations[operation] = declareOperation({
          query,
          operation,
          key: name || this[NAME],
        });
      });

    return resultQueryOperations;
  }

  /**
   * Cast a value to match the specific field or throw an exception
   * @param {Mixed} value the value to cast
   * @returns {Mixed} value the value casted to the specific schemaField type configuration
   */
  castValue(value) {
    return value;
  }

  /**
   * This method need to return the schema field shorcut and class name exposed by ilorm
   * @returns {void} Return nothing
   */
  static getFieldDefinition() {
    throw new Error('Schema field need to overload BaseSchema.getFieldDefinition static method');
  }
}

module.exports = BaseSchemaField;
