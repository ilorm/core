'use strict';

/**
 * This file contains relation system.
 * The relation system is used to declare reference (model which reference another one).
 * The reference could be use to create powerful query.
 *
 * A reference could be explained as :
 * ModelA.referenceA = modelB.referenceB
 *
 * In most case, one of reference is a primary key :
 * ModelA.primaryKey = modelB.referenceB
 * OR
 * modelA.referenceA = modelB.primaryKey
 */

// Symbol which represent a primary key (in the relation system).
const Primary = Symbol('PRIMARY_KEY');

/**
 * Inject ilorm context in the relation field
 * @param {Ilorm} ilorm The ilorm context linked with the given relation
 * @returns {Relation} Return the relation class
 */
const injectIlorm = ilorm => {
  // Map used to store every reference
  // The map is this kind of value : Map<String, Map<String, Relation>>
  const { modelsRelationsIndex: references, } = ilorm;

  /**
   * Save a relation between two model.
   * This method is used as helper to the main function "declareRelation"
   * @param {String} modelA The model to use as reference
   * @param {String|Symbol} referenceA The field used to modelA side to reference modelB
   * @param {String} modelB The model to use as referenced
   * @param {String|Symbol} referenceB The field used to modelB side to reference modelA
   * @param {Relation} Relation The relation class to instantiate
   * @returns {void} Return nothing
   */
  const declareRelationSide = ({ modelA, referenceA, modelB, referenceB, Relation, }) => {
    if (!references.has(modelA)) {
      references.set(modelA, new Map());
    }

    // Store in the map :
    // Map<modelAName, Map<modelBName, { fieldReferenceA, fieldReferenceB }>>
    references.get(modelA).set(modelB, new Relation({
      modelA,
      modelB,
      referenceA,
      referenceB,
    }));
  };


  /**
   * Represent a relation between two model
   */
  class Relation {
    /**
     * Create a new relation between two model
     * @param {String} modelA The model to use as reference
     * @param {String|Symbol} referenceA The field used to modelA side to reference modelB
     * @param {String} modelB The model to use as referenced
     * @param {String|Symbol} referenceB The field used to modelB side to reference modelA
     */
    constructor({ modelA, referenceA, modelB, referenceB, }) {
      this.modelA = modelA;
      this.modelB = modelB;
      this.referenceA = referenceA;
      this.referenceB = referenceB;
    }

    /**
     * Declare a relation between two items
     * @param {String} modelSource The model which reference another model
     * @param {String|Symbol} attributeSource The field of modelSource used to reference modelReference
     * @param {String} modelReference The model to use as referenced
     * @param {String|Symbol} [attributeReference=Primary] The field of modelReference referenced by attributeSource
     * @return {void} Return nothing
     */
    static declareRelation({ modelSource, attributeSource, modelReference, attributeReference = Primary, }) {
      declareRelationSide({
        modelA: modelSource,
        referenceA: attributeSource,
        modelB: modelReference,
        referenceB: attributeReference,
        Relation: this,
      });
      declareRelationSide({
        modelA: modelReference,
        referenceA: attributeReference,
        modelB: modelSource,
        referenceB: attributeSource,
        Relation: this,
      });
    }

    /**
     * Get relation between two models. The parameters are Model name and not model.
     *
     * @param {String} modelSource Model source name
     * @param {String} modelReference Model which be referenced (model name)
     * @returns {Relation} Return an object explaining the relation between the two models
     */
    static getRelation({ modelSource, modelReference, }) {
      if (!references.has(modelSource)) {
        throw new Error(`${modelSource} does not exists in references map. Could not be linked with ${modelReference}`);
      }

      if (!references.get(modelSource).has(modelReference)) {
        throw new Error(`${modelSource} does not reference ${modelReference}`);
      }

      return references.get(modelSource).get(modelReference);
    }
  }

  Relation.Primary = Primary;

  return Relation;
};

module.exports = injectIlorm;
