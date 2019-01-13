'use strict';

const { FIELDS, OPERATIONS, SORT_BEHAVIOR, } = require('ilorm-constants').QUERY;

/**
 * Declare a sort on the query.
 * @param {BaseQuery} query The query to apply the sort
 * @param {String} key The targeted key to sort
 * @param {String} operation The operation to apply (ascending or descending)
 * @returns {function()} The function to use as sort
 */
const declareOperationSort = ({ query, key, operation }) => {
  const behavior = operation === OPERATIONS.SORT_ASCENDING ? SORT_BEHAVIOR.ASCENDING : SORT_BEHAVIOR.DESCENDING;

  return () => {
    query[FIELDS.SORT].push({
      key,
      behavior,
    });

    return query;
  };
};

module.exports = declareOperationSort;
