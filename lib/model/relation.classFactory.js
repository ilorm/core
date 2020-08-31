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
   * Fetch or insert a relation between two model (create it if not exists).
   * This method is used as helper to the main function "declareRelation"
   * @param {String} modelA The model to use as reference
   * @param {String} modelB The model to use as referenced
   * @returns {Relation} Return relation
   */
  const fetchOrInsertRelation = ({ modelA, modelB, Relation, }) => {
    if (!references.has(modelA)) {
      references.set(modelA, new Map());
    }
    if (!references.has(modelB)) {
      references.set(modelB, new Map());
    }

    // Does not insert relation twice
    if (references.get(modelA).has(modelB)) {
      return references.get(modelA).get(modelB);
    }

    const relation = new Relation({
      modelA,
      modelB,
    });

    // Store in the map :
    // Map<modelAName, Map<modelBName, Relation>>
    references.get(modelA).set(modelB, relation);
    references.get(modelB).set(modelA, relation);

    return relation;
  };


  /**
   * Represent a relation between two model
   */
  class Relation {
    /**
     * Create a new relation between two model
     * @param {String} modelA The model to use as reference
     * @param {String} modelB The model to use as referenced
     */
    constructor({ modelA, modelB, }) {
      this.modelA = modelA;
      this.modelB = modelB;
      this.references = [];
    }

    /**
     * Add a reference tuple to the relation
     * @param {String|Symbol} referenceA The field used to modelA side to reference modelB
     * @param {String|Symbol} referenceB The field used to modelB side to reference modelA
     * @return {void} Return nothing
     */
    addReferenceTuple({ referenceA, referenceB, }) {
      this.references.push([
        referenceA,
        referenceB,
      ]);
    }

    /**
     * Declare a relation between two items
     * @param {String} modelSource The model which reference another model
     * @param {String|Symbol} attributeSource The field of modelSource used to reference modelReferenced
     * @param {String} modelReferenced The model to use as referenced
     * @param {String|Symbol} attributeReferenced The field of modelSource used to reference modelReferenced
     * @return {void} Return nothing
     */
    static declareRelation({ modelSource, attributeSource, modelReferenced, attributeReferenced, }) {
      const linearRelation = [
        {
          model: modelSource,
          attribute: attributeSource,
        }, {
          model: modelReferenced,
          attribute: attributeReferenced,
        },
      ].sort((mA, mB) => (
        mA.model.getName() - mB.model.getName()
      ));

      const relation = fetchOrInsertRelation({
        modelA: linearRelation[0].model,
        modelB: linearRelation[1].model,
        Relation: this,
      });

      relation.addReferenceTuple({
        referenceA: linearRelation[0].attribute,
        referenceB: linearRelation[1].attribute,
      });
    }

    /**
     * Get relation between two models. The parameters are Model name and not model.
     *
     * @param {String} modelSource Model source name
     * @param {String} modelReferenced Model which be referenced (model name)
     * @returns {Relation} Return an object explaining the relation between the two models
     */
    static getRelation({ modelSource, modelReferenced, }) {
      if (!references.has(modelSource)) {
        throw new Error(
          `${modelSource} does not exists in references map. Could not be linked with ${modelReferenced}`
        );
      }

      if (!references.get(modelSource).has(modelReferenced)) {
        throw new Error(`${modelSource} does not reference ${modelReferenced}`);
      }

      return references.get(modelSource).get(modelReferenced);
    }
  }

  Relation.Primary = Primary;

  return Relation;
};

module.exports = injectIlorm;
