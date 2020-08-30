'use strict';

const { baseModelClassFactory, modelFactory, } = require('./model');
const { BaseSchema, } = require('./schema');
const { baseQueryClassFactory, } = require('./query');
const {
  baseField,
  booleanFieldFactory,
  dateFieldFactory,
  numberFieldFactory,
  stringFieldFactory,
} = require('./fields');

/**
 * Class representing the full library
 */
class Ilorm {
  /**
   * Init the lib class
   */
  constructor() {
    /**
     * Reference all models class linked with the ilorm instance
     * @type {Map<String, Model>}
     */
    this.modelsIndex = new Map();

    /**
     * Reference all Model relations
     * @type {Map<String, Map<String, Relation>>}
     */
    this.modelsRelationsIndex = new Map();

    // Base Class used by the framework:
    this.BaseModel = baseModelClassFactory(this);
    this.BaseQuery = baseQueryClassFactory(this);
    this.BaseField = baseField;
    this.Fields = {
      booleanFieldFactory,
      dateFieldFactory,
      numberFieldFactory,
      stringFieldFactory,
    };
    this.Schema = Object.assign(BaseSchema, this.getFields());

    // Little hack to permit destructuring library:
    this.declareModel = this.declareModel.bind(this);
    this.newModel = this.newModel.bind(this);
    this.use = this.use.bind(this);
  }

  /**
   * Declare a new model linked with ilorm
   * @param {Model} Model a class Model to declare
   * @returns {Boolean} Return true if erase an existing model
   */
  declareModel(Model) {
    const isModelExists = this.modelsIndex.has(Model.getName());

    this.modelsIndex.set(Model.getName(), Model);

    return isModelExists;
  }

  /**
   * Utility method to generate all fields (potentially overload).
   * @returns {Object} Return Schema fields
   */
  getFields() {
    const Types = {};
    const factories = {};

    for (const fieldFactory of Object.values(this.Fields)) {
      const Class = fieldFactory({
        ilorm: this,
        Field: this.BaseField,
        Fields: this.Fields,
      });
      const {
        name,
        factory,
      } = Class.getFieldDefinition();

      Types[name] = Class;
      factories[factory] = (...params) => new Class(...params);
    }

    return {
      Types,
      ...factories,
    };
  }

  /**
   * Create a new modem
   * @param {Connector} connector the connector to use in the model
   * @param {String} name The model name
   * @param {Object} pluginsOptions Different kind of options to give to the model
   * @param {Schema} schema The schema linked with the model
   * @returns {Model} Return a Model class to use
   */
  newModel({ connector, name, pluginsOptions, schema, }) {
    return modelFactory({
      connector,
      ilorm: this,
      name,
      pluginsOptions,
      schema,
    });
  }

  /**
   * Bind a plugin to the ilorm context
   * @param {Object} plugins Plugins to bind to ilorm
   * @returns {Void} Return nothing
   */
  use({ plugins, }) {

    // Handle core plugins ;
    if (plugins.core) {
      const {
        modelFactory,
        queryFactory,
        schemaFactory,
        baseFieldFactory,
        fieldFactories,
      } = plugins.core;

      // Overload base class:
      if (baseFieldFactory) {
        this.BaseField = baseFieldFactory(this.BaseField);
      }
      if (fieldFactories) {
        for (const field of Object.keys(fieldFactories)) {
          const previousFactory = this.Fields[field];

          this.Fields[field] = ({ Fields, Field, ilorm, }) => {
            const ParentField = previousFactory ?
              previousFactory({
                Field,
                Fields,
                ilorm,
              }) : this.BaseField;

            return fieldFactories[field]({
              Field: ParentField,
              Fields,
              ilorm,
            });
          };
        }
        this.Schema = Object.assign(schemaFactory(this.Schema), this.getFields());
      }
      if (schemaFactory) {
        this.Schema = Object.assign(schemaFactory(this.Schema), this.getFields());
      }
      if (modelFactory) {
        this.BaseModel = modelFactory(this.BaseModel);
      }
      if (queryFactory) {
        this.BaseQuery = queryFactory(this.BaseQuery);
      }
    }
  }
}

module.exports = Ilorm;

