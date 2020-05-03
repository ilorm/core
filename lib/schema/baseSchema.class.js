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

const UNDEFINED_INDEX = -1;
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
    this.definition = schemaDefinition;
    this.properties = Object.keys(this.definition);
    this.options = {
      ...options,
      ...DEFAULT_OPTIONS,
    };

    this[SCHEMA.PRIMARY_KEYS] = [];

    schemaPluginOption.forEach(pluginField => {
      this[pluginField] = [];
    });
    this.properties.forEach(property => {
      this.definition[property][FIELD.NAME] = property;

      if (this.definition[property][FIELD.IS_PRIMARY]) {
        this[SCHEMA.PRIMARY_KEYS].push(this.definition[property]);
      }

      schemaPluginOption.forEach(pluginField => {
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
    this.properties.forEach(property => {
      this.definition[property].bindWithModel({
        InternalModel,
        property,
      });
    });
  }

  /**
   * Init a new instance following the schema
   * @param {Object=} rawObject the base object to use
   * @return {Object} An object following the schema (init or raw json)
   */
  async init(rawObject = {}) {
    const rawProperties = Object.keys(rawObject);

    await Promise.all(this.properties.map(async property => {
      await this.definition[property].init(rawObject, property);

      const rawPropertyIndex = rawProperties.indexOf(property);

      if (rawPropertyIndex !== UNDEFINED_INDEX) {
        rawProperties.splice(rawPropertyIndex, 1);
      }
    }));

    if (rawProperties.length > 0 && this.undefinedPropertyPolicy !== UNDEFINED_PROPERTIES_POLICY.KEEP) {
      if (this.undefinedPropertyPolicy === UNDEFINED_PROPERTIES_POLICY.ERROR) {
        throw new Error(`Undefined property declared in the raw object : ${rawProperties[0]}`);
      }

      // UNDEFINED_PROPERTIES_POLICY.ERASE
      rawProperties.forEach(rawProperty => {
        delete rawObject[rawProperty];
      });
    }

    return rawObject;
  }

  /**
   * Create a new instance from a model, respecting the given schema
   * @param {Object} modelInstance the object to use as a model
   * @returns {Object} Create a new object respecting the schema
   */
  async initInstance(modelInstance = {}) {
    const instance = {};

    const initAllFields = this.properties.map(async property => {
      const value = await this.definition[property].init(modelInstance, property);

      if (value !== undefined) {
        instance[property] = value;
      }

      return null;
    });

    await Promise.all(initAllFields);

    return instance;
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
