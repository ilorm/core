'use strict';

const { OPERATIONS, FIELDS, } = require('../constants').QUERY;
const declareOperation = require('./helpers/declareOperation');

const DATE_OPERATIONS = [
  OPERATIONS.GREATER_THAN,
  OPERATIONS.GREATER_OR_EQUAL_THAN,
  OPERATIONS.LOWER_THAN,
  OPERATIONS.LOWER_OR_EQUAL_THAN,
];

/**
 * Generate DateField class from Field
 * @param {Field} Field to overload
 * @returns {DateField} The new Date field
 */
const getDateField = ({ Field, }) => {
  /**
   * Representing a date in the schema field
   */
  class DateField extends Field {

    /**
     * Return the query operation associated with the given schema field
     * @param {Query} query the instance of query to use
     * @param {Field[]|Null} [ancestorFields=Null] For document database, handle field hierarchy
     * @return {Object} The query operations
     */
    getQueryOperations({ name, query, ancestorFields = null, }) {
      const queryOperations = {
        ...super.getQueryOperations({
          name,
          query,
          ancestorFields,
        }),
        [OPERATIONS.BETWEEN]: declareOperation({
          name,
          query,
          operation: OPERATIONS.BETWEEN,
          field: this,
          ancestorFields,
          castValue: ({ min, max, }) => ({
            min: this.castValue(min),
            max: this.castValue(max),
          }),
        }),
        [OPERATIONS.ADD]: declareOperation({
          name,
          query,
          operation: OPERATIONS.ADD,
          operationType: FIELDS.UPDATE,
          field: this,
          ancestorFields,
        }),
        ...DATE_OPERATIONS.reduce((operations, currentOperation) => ({
          ...operations,
          [currentOperation]: declareOperation({
            name,
            query,
            operation: currentOperation,
            field: this,
            ancestorFields,
          }),
        }), {}),
      };

      return queryOperations;
    }

    /**
     * Check if the given value is valid for the given field
     * @param {*} value The value to check
     * @return {boolean} Return true if the given value is valid of the current field
     */
    isValid(value) {
      return super.isValid(value) &&
        (value === null || value === undefined || (typeof value === 'object' && value instanceof Date));
    }

    /**
     * Cast a value to match the specific field or throw an exception
     * @param {Mixed} value the value to cast
     * @returns {Date} value the value casted to the specific fields type configuration
     */
    castValue(value) {
      const parentCasting = super.castValue(value);

      if (parentCasting === null || parentCasting === undefined) {
        return parentCasting;
      }

      if (parentCasting instanceof Date) {
        return parentCasting;
      }

      return new Date(parentCasting);
    }

    /**
     * Return the definition of the schema field.
     * (used by ilorm to define exposed)
     * @return {{name: string, factory: string}} Return the definition of this schema field
     */
    static getFieldDefinition() {
      return {
        name: 'Date',
        factory: 'date',
      };
    }
  }

  return DateField;
};

module.exports = getDateField;
