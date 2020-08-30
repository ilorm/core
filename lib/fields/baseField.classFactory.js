'use strict';

const { QUERY, FIELD, } = require('../constants');
const { OPERATIONS, FIELDS, } = QUERY;
const { NAME, IS_PRIMARY, IS_REQUIRED, DEFAULT, BOUND_MODEL, } = FIELD;
const declareOperation = require('./helpers/declareOperation');
const declareSelect = require('./helpers/declareSelect');
const declareSort = require('./helpers/declareSort');

const FIELDS_OPERATIONS = [
  OPERATIONS.IS,
  OPERATIONS.IS_NOT,
  OPERATIONS.IS_IN,
  OPERATIONS.IS_NOT_IN,
];

/**
 * Inject ilorm to the class to bind current ilorm with BaseModel
 * @param {Ilorm} ilorm The ilorm context
 * @returns {BaseModel} Return the baseModel to use
 */
// eslint-disable-next-line no-unused-vars,require-jsdoc
const injectIlorm = ilorm => {
  /**
   * Class representing a field of the schema
   */
  class BaseField {

    /**
     * Create a new Schema field
     */
    constructor() {
      this[IS_PRIMARY] = false;
      this[IS_REQUIRED] = false;
      this[DEFAULT] = undefined;
      this[NAME] = null;
      this[BOUND_MODEL] = null;
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
     * Declare the field as primary key
     * @param {boolean} [isPrimary=true] define the isPrimary internal value
     * @return {Field} Return to field (to chain definition)
     */
    primary(isPrimary = true) {
      this[IS_PRIMARY] = isPrimary;

      return this;
    }

    /**
     * Declare the field as required
     * @param {boolean} [isRequired=true] define the field as required or not
     * @return {Field} Return the field (to chainable definition)
     */
    required(isRequired = true) {
      this[IS_REQUIRED] = isRequired;

      return this;
    }

    /**
     * Set the default value of the field
     * @param {*} value The default value
     * @return {Field} Return the field (to chainable definition)
     */
    default(value) {
      this[DEFAULT] = value;

      return this;
    }

    /**
     * Calling at schema binding with model.
     * Could be use to implement specific link between Model class and Field.
     * @param {Model} The model associate with the given field
     * @returns {Void} Return nothing
     */
    bindWithModel({ InternalModel, }) {
      this[BOUND_MODEL] = InternalModel;
    }

    /**
     * Return the query operation associated with the given schema field
     * @param {Query} query the instance of query to use
     * @param {Array.<String>} additionalOperations Add operations to the field builder
     * @param {Field[]|Null} [ancestorFields=Null] For document database, handle field hierarchy
     * @return {Object} The query operations
     */
    getQueryOperations({ query, name, additionalOperations = [], ancestorFields = null, }) {
      const resultQueryOperations = {
        [OPERATIONS.SET]: params => {
          if (!this.isValid(params)) {
            throw new Error(`${params} is not a valid value for field ${name}`);
          }

          query[FIELDS.UPDATE].push({
            field: this,
            operator: OPERATIONS.SET,
            value: params,
            ancestorFields,
          });

          return query;
        },
        [OPERATIONS.SELECT]: declareSelect({
          query,
          operation: OPERATIONS.SELECT,
          field: this,
          ancestorFields,
        }),
        [OPERATIONS.SELECT_ONLY]: declareSelect({
          query,
          operation: OPERATIONS.SELECT_ONLY,
          field: this,
          ancestorFields,
        }),
        [OPERATIONS.SORT_ASCENDING]: declareSort({
          query,
          operation: OPERATIONS.SORT_ASCENDING,
          field: this,
          ancestorFields,
        }),
        [OPERATIONS.SORT_DESCENDING]: declareSort({
          query,
          operation: OPERATIONS.SORT_DESCENDING,
          field: this,
          ancestorFields,
        }),
      };

      FIELDS_OPERATIONS
        .concat(additionalOperations)
        .forEach(operation => {
          resultQueryOperations[operation] = declareOperation({
            query,
            operation,
            field: this,
            ancestorFields,
          });
        });

      return resultQueryOperations;
    }

    /**
     * Cast a value to match the specific field or throw an exception
     * @param {Mixed} value the value to cast
     * @returns {Mixed} value the value casted to the specific fields type configuration
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

  return BaseField;
};

module.exports = injectIlorm;
