'use strict';

const { FIELDS, OPERATIONS, SORT_BEHAVIOR, } = require('../../constants').QUERY;

/**
 * Declare a sort on the query.
 * @param {BaseQuery} query The query to apply the sort
 * @param {Field} field The targeted key to sort
 * @param {String} operation The operation to apply (ascending or descending)
 * @param {Object} [chainObject=Query] The object returned by the operator for chaining call
 * @returns {function()} The function to use as sort
 */
const declareOperationSort = ({ query, field, operation, chainObject, }) => {
  const behavior = operation === OPERATIONS.SORT_ASCENDING ? SORT_BEHAVIOR.ASCENDING : SORT_BEHAVIOR.DESCENDING;

  return () => {
    query[FIELDS.SORT].push({
      field,
      behavior,
    });

    return chainObject;
  };
};

module.exports = declareOperationSort;
