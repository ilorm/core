'use strict';

const { SCHEMA_FIELD, } = require('ilorm-constants');
const { OPERATIONS, FIELDS, } = require('ilorm-constants').QUERY;
const declareOperation = require('./helpers/declareOperation');

const NUMBER_OPERATIONS = [
  OPERATIONS.BETWEEN,
  OPERATIONS.GREATER_THAN,
  OPERATIONS.GREATER_OR_EQUAL_THAN,
  OPERATIONS.LOWER_THAN,
  OPERATIONS.LOWER_OR_EQUAL_THAN,
];

/**
 * Generate NumberField class from SchemaField
 * @param {SchemaField} SchemaField to overload
 * @returns {NumberField} The new Number field
 */
const getNumberField = ({ SchemaField, }) => {
  /**
   * Class representing a Number field
   */
  class NumberField extends SchemaField {

    /**
     * Return the query operation associated with the given schema field
     * @param {Query} query the instance of query to use
     * @param {Array.<String>} additionalOperations Add operations to the field builder
     * @return {Object} The query operations
     */
    getQueryOperations({ name, query, additionalOperations = [], }) {
      const queryOperations = super.getQueryOperations({
        name,
        query,
        additionalOperations: NUMBER_OPERATIONS.concat(additionalOperations),
      });

      queryOperations[OPERATIONS.ADD] = declareOperation({
        name,
        query,
        operation: OPERATIONS.ADD,
        key: this[SCHEMA_FIELD.NAME],
        field: FIELDS.UPDATE,
      });

      return queryOperations;
    }

    /**
     * Check if the given value is valid for the given field
     * @param {*} value The value to check
     * @return {boolean} Return true if the given value is valid of the current field
     */
    async isValid(value) {
      return await super.isValid(value) && (value === null || value === undefined || typeof value === 'number');
    }

    /**
     * Cast a value to match the specific field or throw an exception
     * @param {Mixed} value the value to cast
     * @returns {Number} value the value casted to the specific schemaField type configuration
     */
    castValue(value) {
      if (value === null || value === undefined) {
        return value;
      }

      if (typeof value === 'number') {
        return value;
      }

      const result = parseFloat(value);

      if (isNaN(result)) {
        throw new Error(`${value} is not a valid number.`);
      }

      return result;
    }

    /**
     * Return the definition of the schema field.
     * (used by ilorm to define exposed)
     * @return {{name: string, factory: string}} Return the definition of this schema field
     */
    static getFieldDefinition() {
      return {
        name: 'Number',
        factory: 'number',
      };
    }
  }

  return NumberField;
};

module.exports = getNumberField;
