'use strict';

const { FIELD, QUERY, } = require('../constants');

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
const RELATION_TYPES = {
  ONE_TO_ONE: Symbol('ONE_TO_ONE'),
  ONE_TO_MANY: Symbol('ONE_TO_MANY'),
  MANY_TO_ONE: Symbol('MANY_TO_ONE'),
  MANY_TO_MANY: Symbol('MANY_TO_MANY'),
};

/**
 * Inject ilorm context in the relation field
 * @param {Ilorm} ilorm The ilorm context linked with the given relation
 * @returns {Relation} Return the relation class
 */
const injectIlorm = (ilorm) => {
  // Map used to store every reference
  // The map is this kind of value : Map<String, Map<String, Relation>>
  const { modelsRelationsIndex: references, } = ilorm;

  /**
   * Fetch or insert a relation between two model (create it if not exists).
   * This method is used as helper to the main function "declareRelation"
   * @param {Model} modelA The model to use as reference
   * @param {Model} modelB The model to use as referenced
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
      this.type = null;
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
     * At first call of getRelation, method to find the type of the relation.
     * (Internal function)
     * @returns {void} Return nothing
     */
    initReferenceType() {
      // primaryTuple = [ primaryKeysOfModelA, primaryKeysOfModelB ]
      const primaryTuple = [
        this.modelA,
        this.modelB,
      ].map((model) => model.getSchema().getPrimaryKeys())
        .map((primaryKeyList) => primaryKeyList.map((primaryKey) => primaryKey[FIELD.NAME]));

      // Check if a references set includes all primary keys of a model;
      // [ true, true ] => all primary keys of both modelA et modelB are referenced (ONE_TO_ONE).
      // [ true, false ] => all primary of modelA is referenced not B (ONE_TO_MANY)
      // ...
      const isPrimaryTuple = this.references
        .reduce(([ isPrimaryA, isPrimaryB, ], refField) => ([
          isPrimaryA && primaryTuple[0].includes(refField[0]),
          isPrimaryB && primaryTuple[1].includes(refField[1]),
        ]), [ true, true, ]);

      if (isPrimaryTuple[0]) {
        if (isPrimaryTuple[1]) {
          this.type = RELATION_TYPES.ONE_TO_ONE;

          return;
        }
        this.type = RELATION_TYPES.ONE_TO_MANY;

        return;
      }
      if (isPrimaryTuple[1]) {
        this.type = RELATION_TYPES.MANY_TO_ONE;

        return;
      }
      this.type = RELATION_TYPES.MANY_TO_MANY;
    }

    /**
     * Apply the relation constraint to a query based on ids
     * @param {Query} query The query to use to apply the constraint
     * @param {Object} ids The ids object to use as constraint
     * @returns {void} Return nothing
     */
    applyToQuery({ query, ids, }) {
      const model = query[QUERY.FIELDS.MODEL];

      let leftOperator = 0;

      if (model === this.modelB) {
        leftOperator = 1;
      } else if (model !== this.modelA) {
        throw new Error(`Try applying query (${model.getName()}) not bound to the relation` +
        `(${this.modelA.getName()}:${this.modelB.getName}`);
      }

      this.references.forEach((reference) => {
        query[reference[leftOperator]].is(ids[reference[1 - leftOperator]]);
      });
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
          `${modelSource.getName()} does not exists in references map.` +
          ` Could not be linked with ${modelReferenced.getName()}`
        );
      }

      if (!references.get(modelSource).has(modelReferenced)) {
        throw new Error(`${modelSource.getName()} does not reference ${modelReferenced.getName()}`);
      }

      const reference = references.get(modelSource).get(modelReferenced);

      if (!reference.type) {
        reference.initReferenceType();
      }

      return reference;
    }
  }

  Relation.TYPES = RELATION_TYPES;

  return Relation;
};

module.exports = injectIlorm;
