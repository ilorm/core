'use strict';

const { FIELDS, OPERATIONS, SORT_BEHAVIOR, } = require('../../constants').QUERY;

/**
 * Declare a sort on the query.
 * @param {BaseQuery} query The query to apply the sort
 * @param {Field} field The targeted key to sort
 * @param {String} operation The operation to apply (ascending or descending)
 * @param {Field[]|Null} [ancestorFields=Null] For document database, handle field hierarchy
 * @returns {function()} The function to use as sort
 */
const declareOperationSort = ({ query, field, operation, ancestorFields = null, }) => {
  const behavior = operation === OPERATIONS.SORT_ASCENDING ? SORT_BEHAVIOR.ASCENDING : SORT_BEHAVIOR.DESCENDING;

  return () => {
    query[FIELDS.SORT].push({
      field,
      behavior,
      ancestorFields,
    });

    return query;
  };
};

module.exports = declareOperationSort;
