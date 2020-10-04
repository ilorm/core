'use strict';

const { SCHEMA, FIELD, } = require('../constants');
const UNDEFINED_PROPERTIES_POLICY = {
  KEEP: 'keep',
  ERROR: 'error',
  ERASE: 'erase',
};

const DEFAULT_OPTIONS = {
  undefinedProperties: UNDEFINED_PROPERTIES_POLICY.ERASE,
};

const schemaPluginOption = [];

/**
 * Class representing schema of data
 */
class BaseSchema {
  /**
   * Instantiate a new schema
   * @param {Object} schemaDefinition The definition to apply
   * @param {Object} options Options to apply to the schema
   */
  constructor(schemaDefinition, options = {}) {
    this.pastSchema = [];
    this.definition = schemaDefinition;
    this.properties = Object.keys(this.definition);
    this.options = {
      ...options,
      ...DEFAULT_OPTIONS,
    };

    this[SCHEMA.PRIMARY_KEYS] = [];

    schemaPluginOption.forEach((pluginField) => {
      this[pluginField] = [];
    });
    this.properties.forEach((property) => {
      this.definition[property][FIELD.NAME] = property;

      if (this.definition[property][FIELD.IS_PRIMARY]) {
        this[SCHEMA.PRIMARY_KEYS].push(this.definition[property]);
      }

      schemaPluginOption.forEach((pluginField) => {
        if (this.definition[property][pluginField]) {
          this[pluginField].push(property);
        }
      });
    });
    this.undefinedPropertyPolicy = options.undefinedPropertyPolicy;
  }

  /**
   * Create a copy of schema from the given instance
   * @param {BaseSchema} schema The schema to copy
   * @returns {BaseSchema} The copy of the schema
   */
  static copy(schema) {
    return new this(schema.definition, schema.options);
  }

  /**
   * Declare the function to run to apply this schema (in schema migration)
   * @param {Function} handler The handler to run
   * @returns {Schema} Return schema for chained call
   */
  up(handler) {
    this.onUp = handler;

    return this;
  }

  /**
   * Declare the function to rollback from this schema (in schema migration)
   * @param {Function} handler The handler to run
   * @returns {Schema} Return schema for chained call
   */
  down(handler) {
    this.onDown = handler;

    return this;
  }

  /**
   * Declare a past version of the current schema
   * @param {Number} timestamp The timestamp associate with this schema version
   * @param {Object} schema The previous schema definition
   * @returns {Schema} Return version of the schema for chained call
   */
  version(timestamp, schema) {
    const instantiatedSchema = new this.constructor(schema);

    instantiatedSchema.timestamp = timestamp;

    this.pastSchema.push(instantiatedSchema);
    this.pastSchema.sort((schemaA, schemaB) => schemaB.timestamp - schemaA.timestamp);

    return instantiatedSchema;
  }

  /**
   * Return primary key of the current schema
   * @returns {Field[]} An array of schema field
   */
  getPrimaryKeys() {
    return this[SCHEMA.PRIMARY_KEYS];
  }

  /**
   * Bind current schema with the current model
   * @param {InternalModel} InternalModel The model to bind with the schema
   * @returns {Void} Return nothing
   */
  bindWithModel({ InternalModel, }) {
    this.properties.forEach((property) => {
      this.definition[property].bindWithModel({
        InternalModel,
      });
    });
  }

  /**
   * Create a new instance from a model, respecting the given schema
   * @param {Object} modelInstance the object to use as a model
   * @returns {Object} Create a new object respecting the schema
   */
  initInstance(modelInstance = {}) {
    this.properties.forEach((property) => this.definition[property].init(modelInstance, property));
  }

  /**
   * Check if a json object valid the given schema
   * TODO
   * @return {null} null;
   */
  isValid() {
    return null;
  }

  /**
   * Return list of field associated with the given plugin option
   * @param {Symbol} pluginOption The plugin option to use
   * @returns {Array.<String>} List of field associated with the given plugin option
   */
  getFieldsAssociatedWithPlugin(pluginOption) {
    return this[pluginOption] || [];
  }

  /**
   * Add a new tracked field to your schemaPluginOption
   * @param {String} pluginOption The field to track
   * @returns {void} return nothing
   */
  static declarePluginOption(pluginOption) {
    schemaPluginOption.push(pluginOption);
  }
}

module.exports = BaseSchema;
