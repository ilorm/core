'use strict';

module.exports = {
  FIELDS: {
    // The proxy in front of the current query
    SELF_PROXY: Symbol('self_proxy'),

    // The current query without proxy
    SELF: Symbol('self'),

    // The target connector of the query :
    CONNECTOR: Symbol('connector'),

    // Declare the number of element to query during the run of the query
    LIMIT: Symbol('limit'),

    // Build a query with linked with clause :
    LINKED_WITH: Symbol('linkedWith'),

    // The linked model :
    MODEL: Symbol('model'),

    // The current query state (the query will be run on the connector) :
    QUERY: Symbol('query'),

    // Current query state if you enable branch or :
    QUERY_OR: Symbol('queryOr'),

    // The schema associated with the query :
    SCHEMA: Symbol('schema'),

    // Declare Select specific fields
    SELECT: Symbol('select'),

    // Declare element to ignore during the run of the query
    SKIP: Symbol('skip'),

    // Declare sort
    SORT: Symbol('sort'),

    // The current update state (the update will be run on the connector) :
    UPDATE: Symbol('update'),
  },

  SELECT_BEHAVIOR: {
    ALL: Symbol('selectAll'),
    MULTIPLE: Symbol('selectMultiple'),
    ONE: Symbol('selectOne'),
  },

  SORT_BEHAVIOR: {
    ASCENDING: Symbol('ascending'),
    DESCENDING: Symbol('descending'),
  },

  OPERATIONS: {
    // Basic operations :
    IS: 'is',
    IS_NOT: 'isNot',
    IS_IN: 'isIn',
    IS_NOT_IN: 'isNotIn',

    // Date or number :
    BETWEEN: 'between',
    GREATER_OR_EQUAL_THAN: 'greaterOrEqualThan',
    LOWER_OR_EQUAL_THAN: 'lowerOrEqualThan',
    GREATER_THAN: 'greaterThan',
    LOWER_THAN: 'lowerThan',

    // Reference :
    LINKED_WITH: 'linkedWith',

    // Update :
    SET: 'set',
    ADD: 'add',

    // Sort
    SORT_ASCENDING: 'useAsSortAsc',
    SORT_DESCENDING: 'useAsSortDesc',

    // Select
    SELECT_ONLY: 'selectOnly',
    SELECT: 'select',
  },
};
