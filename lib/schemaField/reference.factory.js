'use strict';

const { OPERATIONS, FIELDS, } = require('ilorm-constants').QUERY;
const declareOperation = require('./helpers/declareOperation');
const modelsRelationShipClassFactory = require('../model/relation.classFactory');

const REFERENCE = Symbol('Reference');

/**
 * Generate ReferenceField class from SchemaField
 * @param {SchemaField} SchemaField to overload
 * @returns {ReferenceField} The new Reference field
 */
const getReferenceField = ({ ilorm, SchemaField, }) => {
  const modelsRelationShip = modelsRelationShipClassFactory(ilorm);

  /**
   * Class representing a reference field
   */
  class ReferenceField extends SchemaField {
    /**
     * Instantiate a new reference field.
     * @param {String} reference Set model name linked with the current reference
     */
    constructor(reference) {
      super();

      this[REFERENCE] = reference;
    }

    /**
     * Return the query operation associated with the given schema field
     * @param {Query} query the instance of query to use
     * @return {Object} The query operations
     */
    getQueryOperations({ query, name, additionalOperations = [], }) {
      const resultQueryOperations = super.getQueryOperations({
        additionalOperations,
        query,
        name,
      });

      resultQueryOperations[OPERATIONS.LINKED_WITH] = declareOperation({
        query,
        operation: OPERATIONS.LINKED_WITH,
        field: FIELDS.QUERY,
        key: this.name,
      });

      return resultQueryOperations;
    }

    /**
     * Bind current schema field reference with the current model
     * @param {InternalModel} InternalModel The model to bind with the schema field
     * @param {String} property name of the current reference
     * @returns {Void} Return nothing
     */
    bindWithModel({ InternalModel, property, }) {
      modelsRelationShip.declareRelation({
        modelSource: InternalModel.getName(),
        attributeSource: property,
        modelReference: this[REFERENCE],
      });
    }

    /**
     * Return the definition of the schema field.
     * (used by ilorm to define exposed)
     * @return {{name: string, factory: string}} Return the definition of this schema field
     */
    static getFieldDefinition() {
      return {
        name: 'Reference',
        factory: 'reference',
      };
    }
  }

  return ReferenceField;
};

module.exports = getReferenceField;
