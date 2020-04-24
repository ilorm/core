'use strict';

const { FIELDS, OPERATIONS, SELECT_BEHAVIOR, } = require('ilorm-constants').QUERY;

/**
 * Declare an operation linked with the query
 * @param {Object} query The query where the operation is declared
 * @param {String} key The property field linked with the operation
 * @param {String} operation The operation to apply
 * @param {String} [field=Query] The field to update in the query instance
 * @returns {Function} Return a function to apply input to the given context
 */
const declareOperationFactory = ({ query, key, operation, }) => (

  /**
   * Apply the specific sort options
   * @returns {Object} Return the query item with the applied params
   */
  () => {
    if (operation === OPERATIONS.SELECT_ONLY) {
      if (query[FIELDS.SELECT].behavior !== SELECT_BEHAVIOR.ALL) {
        throw new Error(`Could not select only field ${key}, if you already selected others fields.`);
      }

      query[FIELDS.SELECT].behavior = SELECT_BEHAVIOR.ONE;
      query[FIELDS.SELECT].fields.push(key);

      return query;
    }

    if (query[FIELDS.SELECT].behavior === SELECT_BEHAVIOR.ONE) {
      const [ field, ] = query[FIELDS.SELECT].fields;

      throw new Error(`Could not select field ${key}, if you already selectOnly the field ${field}`);
    }

    query[FIELDS.SELECT].behavior = SELECT_BEHAVIOR.MULTIPLE;
    query[FIELDS.SELECT].fields.push(key);

    return query;
  }
);

module.exports = declareOperationFactory;
