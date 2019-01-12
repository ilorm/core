'use strict';

const { LIMIT, QUERY, QUERY_OR, SELECT, SKIP, SORT, } = require('ilorm-constants').QUERY.FIELDS;

/**
 * Call onOperator if exists, per each operator bind with the current query
 * @param {BaseQuery} queryClass The query class to use
 * @param {Function} onOperator The function handler to call
 * @returns {void} return nothing
 */
const handleOnOperator = (queryClass, onOperator) => {
  if (onOperator) {
    for (const { field, operator, value, } of queryClass[QUERY]) {
      onOperator(field, operator, value);
    }
  }
};

/**
 * Call onOptions if exists, to pass options to the connector
 * @param {BaseQuery} queryClass The query class to use
 * @param {Function} onOptions The function handler to call
 * @returns {void} return nothing
 */
const handleOptions = (queryClass, onOptions) => {
  if (onOptions) {
    onOptions({
      skip: queryClass[SKIP],
      limit: queryClass[LIMIT],
    });
  }
};

/**
 * Call onOr if exists, per each or branch on the current query
 * @param {BaseQuery} queryClass The query class to use
 * @param {Function} onOr The function handler to call
 * @returns {void} return nothing
 */
const handleOr = (queryClass, onOr) => {
  if (onOr && queryClass[QUERY_OR]) {
    queryClass[QUERY_OR].forEach(onOr);
  }
};

/**
 * Call onSelect if exists, per each selected field in the current query
 * @param {BaseQuery} queryClass The query class to use
 * @param {Function} onSelect The function handler to call
 * @returns {void} return nothing
 */
const handleSelect = (queryClass, onSelect) => {
  if (onSelect && queryClass[SELECT] && queryClass[SELECT].fields && queryClass[SELECT].fields.length > 0) {
    queryClass[SELECT].fields.forEach(field => onSelect({ field, }));
  }
};

/**
 * Call onSort if exists, per each sort field on the current query
 * @param {BaseQuery} queryClass The query class to use
 * @param {Function} onSort The function handler to call
 * @returns {void} return nothing
 */
const handleSort = (queryClass, onSort) => {
  if (onSort) {
    for (const { key, behavior, } of queryClass[SORT]) {
      onSort({
        key,
        behavior,
      });
    }
  }
};

/**
 * Bind query builder function to the queryClass
 * @param {BaseQuery} queryClass The query class to bind the function
 * @returns {Function} Return a query builder
 */
const bindQueryBuilder = queryClass => ({ onOperator, onOptions, onOr, onSelect, onSort, }) => {
  handleOnOperator(queryClass, onOperator);
  handleOptions(queryClass, onOptions);
  handleOr(queryClass, onOr);
  handleSelect(queryClass, onSelect);
  handleSort(queryClass, onSort);
};

module.exports = bindQueryBuilder;
