'use strict';

const { QUERY, } = require('ilorm-constants').QUERY.FIELDS;

/**
 * Declare an operation linked with the query
 * @param {Object} query The query where the operation is declared
 * @param {String} key The property field linked with the operation
 * @param {String} operation The operation to apply
 * @param {String} [field=Query] The field to update in the query instance
 * @returns {Function} Return a function to apply input to the given context
 */
const declareOperationFactory = ({ query, key, operation, field = QUERY, }) => (

  /**
 * Apply the params on the given query field (key, operation).
 * @param {Object} params The params to apply
 * @returns {Object} Return the query item with the applied params
 */
  params => {
    query[field].push({
      field: key,
      operator: operation,
      value: params,
    });

    return query;
  }
);

module.exports = declareOperationFactory;
