'use strict';

/**
 * Generate BooleanField class from SchemaField
 * @param {SchemaField} SchemaField to overload
 * @returns {BooleanField} The new Boolean field
 */
const getBooleanField = ({ SchemaField }) => {

  /**
   * Class representing a Boolean field
   */
  class BooleanField extends SchemaField {
    /**
     * Cast a value to match the specific field or throw an exception
     * @param {Mixed} value the value to cast
     * @returns {Boolean} value the value casted to the specific schemaField type configuration
     */
    castValue(value) {
      return Boolean(value);
    }

    /**
     * Return the definition of the schema field.
     * (used by ilorm to define exposed)
     * @return {{name: string, factory: string}}
     */
    static getFieldDefinition() {
      return {
        name: 'Boolean',
        factory: 'boolean',
      }
    }
  }

  return BooleanField;
};

module.exports = getBooleanField;
