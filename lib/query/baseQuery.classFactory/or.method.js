'use strict';

const { QUERY_OR, MODEL, } = require('ilorm-constants').QUERY.FIELDS;

/**
 * Create the or method from a query instance
 * @param {BaseQuery} query The query to use to create the method or
 * @returns {Function} The or method to use
 */
const orMethod = query => handler => {
  const orClause = [];

  /**
   * The branch function could be invoked to each OR branch you want to describe
   * @returns {Query} The query to use to explain what your branch do
   */
  const branch = () => {
    const branchQuery = query[MODEL].query();

    orClause.push(branchQuery);

    return branchQuery;
  };

  handler(branch);

  if (!query[QUERY_OR]) {
    query[QUERY_OR] = [];
  }

  query[QUERY_OR].push(orClause);

  return query;
};

module.exports = orMethod;
