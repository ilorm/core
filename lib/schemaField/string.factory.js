'use strict';

/**
 * Generate StringField class from SchemaField
 * @param {SchemaField} SchemaField to overload
 * @returns {StringField} The new String field
 */
const getStringField =  ({ SchemaField }) => {
  /**
   * Class representing a String field
   */
  class StringField extends SchemaField {
    /**
     * Cast a value to match the specific field or throw an exception
     * @param {Mixed} value the value to cast
     * @returns {String} value the value casted to the specific schemaField type configuration
     */
    castValue(value) {
      return String(value);
    }

    /**
     * Return the definition of the schema field.
     * (used by ilorm to define exposed)
     * @return {{name: string, factory: string}}
     */
    static getFieldDefinition() {
      return {
        name: 'String',
        factory: 'string',
      }
    }
  }

  return StringField;
};

module.exports = getStringField;
