'use strict';

const assert = require('assert');


const {
  SCHEMA,
  MODEL_ID_CLASS,
} = require('../constants').MODEL;


/**
 * Create a new Model class with the given parameter
 * @param {Connector} connector The connector used by the model
 * @param {Ilorm} ilorm the current ilorm context instance
 * @param {String|Symbol} name The name of the model
 * @param {Object} pluginsOptions Add special plugin configuration
 * @param {Schema} schema The schema used by the model
 * @returns {Model} The new model to use in project
 */
const modelFactory = ({ connector = null, ilorm, name = Symbol('Model'), pluginsOptions = {}, schema, }) => {
  const { BaseModel, } = ilorm;

  assert(schema, 'IlormError: In the model factory the schema can not be undefined');

  /**
   * The InternalModel it's a class created dynamically in function of the schema, the connector and the name
   * given by the model.
   */
  class InternalModel extends BaseModel {
    /**
     * Return the name of the model
     * @returns {String} The name of the model
     */
    static getName() {
      return name;
    }

    /**
     * Return the schema associated with the model
     * @returns {Schema} The schema of the model
     */
    static getSchema() {
      return schema;
    }

    /**
     * Return the connector associated with the model
     * @returns {Connector} The connector of the model
     */
    static getConnector() {
      return connector;
    }

    /**
     * Return the plugins configuration associated with the model
     * @returns {Object} The plugin options
     */
    static getPluginsOptions() {
      return pluginsOptions;
    }
  }
  InternalModel[SCHEMA] = schema;

  const connectorModelParams = {
    name,
    schema,
    ParentModel: InternalModel,
  };

  let ConnectorModel = InternalModel;

  if (connector) {
    ConnectorModel = connector.modelFactory(connectorModelParams);
  }

  ilorm.declareModel(ConnectorModel);

  schema.bindWithModel({
    InternalModel: ConnectorModel,
  });

  InternalModel[MODEL_ID_CLASS] = ilorm.baseModelIdClassFactory({
    ilorm,
    Model: ConnectorModel,
  });

  return ConnectorModel;
};

module.exports = modelFactory;
