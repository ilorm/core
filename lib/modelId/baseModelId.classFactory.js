const assert = require('assert');
const { FIELD, } = require('../constants');

/**
 * Create a class BaseModel bound with ilorm and the given model
 * @param {Model} Model bind to this model
 * @returns {BaseModelId} Return BaseModelId
 */
const baseModelIdFactory = ({ Model, }) => {
  /**
   * A ModelID represent a unique id bound with a model
   */
  class BaseModelId {
    /**
     * Instantiate the baseModelId bound with the given id
     * @param {Mixed} id The id linked with ModelId
     */
    constructor(id) {
      const primaryKeys = Model.getSchema().getPrimaryKeys();

      if (typeof id !== 'object') {
        assert(primaryKeys.length === 1, `IlormError: Try instantiate ModelId with a bad parameter: ${id}`);

        this.id = {
          [primaryKeys[0][FIELD.NAME]]: id,
        };
      } else {
        this.id = {};

        primaryKeys.forEach((primaryKey) => {
          assert(
            id[primaryKey[FIELD.NAME]],
            `IlormError: Try instantiate ModelId, missing key: ${primaryKey[FIELD.NAME]} in ${Object.keys(id)}`
          );

          this.id[primaryKey[FIELD.NAME]] = id[primaryKey[FIELD.NAME]];
        });
      }
    }

  }

  return BaseModelId;
};

module.exports = baseModelIdFactory;


