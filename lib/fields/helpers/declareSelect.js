'use strict';

const { QUERY, FIELD, } = require('ilorm-constants');
const { FIELDS, OPERATIONS, SELECT_BEHAVIOR, } = QUERY;
const { NAME, } = FIELD;

/**
 * Declare an operation linked with the query
 * @param {Object} query The query where the operation is declared
 * @param {Field} field The property field linked with the operation
 * @param {String} operation The operation to apply
 * @returns {Function} Return a function to apply input to the given context
 */
const declareOperationFactory = ({ query, field, operation, }) => (

  /**
   * Apply the specific sort options
   * @returns {Object} Return the query item with the applied params
   */
  () => {
    if (operation === OPERATIONS.SELECT_ONLY) {
      if (query[FIELDS.SELECT].behavior !== SELECT_BEHAVIOR.ALL) {
        throw new Error(`Could not select only field ${field[NAME]}, if you already selected others fields.`);
      }

      query[FIELDS.SELECT].behavior = SELECT_BEHAVIOR.ONE;
      query[FIELDS.SELECT].fields.push(field);

      return query;
    }

    if (query[FIELDS.SELECT].behavior === SELECT_BEHAVIOR.ONE) {
      const [ onlyField, ] = query[FIELDS.SELECT].fields;

      throw new Error(`Could not select field ${field[NAME]}, if you already selectOnly the field ${onlyField[NAME]}`);
    }

    query[FIELDS.SELECT].behavior = SELECT_BEHAVIOR.MULTIPLE;
    query[FIELDS.SELECT].fields.push(field);

    return query;
  }
);

module.exports = declareOperationFactory;
