'use strict';

const { OPERATIONS, } = require('ilorm-constants').QUERY;

const DATE_OPERATIONS = [
  OPERATIONS.BETWEEN,
  OPERATIONS.GREATER_THAN,
  OPERATIONS.GREATER_OR_EQUAL_THAN,
  OPERATIONS.LOWER_THAN,
  OPERATIONS.LOWER_OR_EQUAL_THAN,
];

/**
 * Generate DateField class from SchemaField
 * @param {SchemaField} SchemaField to overload
 * @returns {DateField} The new Date field
 */
const getDateField = SchemaField => {
  /**
   * Representing a date in the schema field
   */
  class DateField extends SchemaField {

    /**
     * Return the query operation associated with the given schema field
     * @param {Query} query the instance of query to use
     * @param {Array.<String>} additionalOperations Add operations to the field builder
     * @return {Object} The query operations
     */
    getQueryOperations({ query, additionalOperations = [], }) {
      return super.getQueryOperations({
        query,
        additionalOperations: DATE_OPERATIONS.concat(additionalOperations),
      });
    }

    /**
     * Cast a value to match the specific field or throw an exception
     * @param {Mixed} value the value to cast
     * @returns {Date} value the value casted to the specific schemaField type configuration
     */
    castValue(value) {
      if (value instanceof Date) {
        return value;
      }

      return new Date(value);
    }
  }

  return DateField;
};

module.exports = getDateField;
