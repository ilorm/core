'use strict';

const { OPERATIONS, FIELDS, } = require('../constants').QUERY;
const declareOperation = require('./helpers/declareOperation');
const { InvalidValueError, } = require('../errors');

const NUMBER_OPERATIONS = [
  OPERATIONS.BETWEEN,
  OPERATIONS.GREATER_THAN,
  OPERATIONS.GREATER_OR_EQUAL_THAN,
  OPERATIONS.LOWER_THAN,
  OPERATIONS.LOWER_OR_EQUAL_THAN,
];

/**
 * Generate NumberField class from Field
 * @param {Field} Field to overload
 * @returns {NumberField} The new Number field
 */
const getNumberField = ({ Field, }) => {
  /**
   * Class representing a Number field
   */
  class NumberField extends Field {

    /**
     * Return the query operation associated with the given schema field
     * @param {Query} query the instance of query to use
     * @param {Array.<String>} additionalOperations Add operations to the field builder
     * @param {Field[]|Null} [ancestorFields=Null] For document database, handle field hierarchy
     * @return {Object} The query operations
     */
    getQueryOperations({ name, query, additionalOperations = [], ancestorFields = null, }) {
      const queryOperations = super.getQueryOperations({
        name,
        query,
        additionalOperations: NUMBER_OPERATIONS.concat(additionalOperations),
        ancestorFields,
      });

      queryOperations[OPERATIONS.ADD] = declareOperation({
        name,
        query,
        operation: OPERATIONS.ADD,
        operationType: FIELDS.UPDATE,
        field: this,
        ancestorFields,
      });

      return queryOperations;
    }

    /**
     * Check if the given value is valid for the given field
     * @param {*} value The value to check
     * @return {boolean} Return true if the given value is valid of the current field
     */
    isValid(value) {
      return super.isValid(value) && (value === null || value === undefined || typeof value === 'number');
    }

    /**
     * Cast a value to match the specific field or throw an exception
     * @param {Mixed} value the value to cast
     * @returns {Number} value the value casted to the specific fields type configuration
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
        throw new InvalidValueError(`${value} is not a valid number.`);
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
