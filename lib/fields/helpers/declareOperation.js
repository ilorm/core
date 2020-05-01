'use strict';

const { QUERY, } = require('ilorm-constants').QUERY.FIELDS;

/**
 * Declare an operation linked with the query
 * @param {Object} query The query where the operation is declared
 * @param {Field} field The field linked with the operation
 * @param {String} operation The operation to apply
 * @param {String} [operationType=Query] The operationType to apply (QUERY or UPDATE)
 * @param {Object} [chainObject=Query] The object returned by the operator for chaining call
 * @returns {Function} Return a function to apply input to the given context
 */
const declareOperationFactory = ({ query, field, operation, operationType = QUERY, chainObject = query, }) => (

  /**
 * Apply the params on the given query field (key, operation).
 * @param {Object} params The params to apply
 * @returns {Object} Return the query item with the applied params
 */
  params => {
    query[operationType].push({
      field,
      operator: operation,
      value: params,
    });

    return chainObject;
  }
);

module.exports = declareOperationFactory;
