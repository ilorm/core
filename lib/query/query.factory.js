'use strict';

const { FIELDS, SELECT_BEHAVIOR, } = require('../constants').QUERY;
const { SCHEMA, MODEL, CONNECTOR, QUERY, UPDATE, SORT, SELECT, } = FIELDS;


/**
 * Create a property option object (Object.defineProperty)
 * With a value field only ;
 * configurable: false,
 * writable: false,
 * enumerable : false,
 * @param {Mixed} variable The variable to associate with the value
 * @returns {Object} The param object
 */
const defineProperty = variable => ({ value: variable, });

/**
 * Create select base in the query class.
 * @returns {Object} Create an object to store the select options on the current query.
 */
const selectBaseFactory = () => ({
  behavior: SELECT_BEHAVIOR.ALL,
  fields: [],
});

/**
 * Create a new Query class from the given context
 * @param {Ilorm} ilorm The ilorm context
 * @param {Model} model The model associated with the Query
 * @returns {Query} A new Query Class
 */
const queryFactory = ({ ilorm, model, }) => {
  const { BaseQuery, } = ilorm;
  const connector = model.getConnector();
  const schema = model.getSchema();

  /**
   * The InternalQuery is a class created dynamically in function of the model.
   */
  class InternalQuery extends BaseQuery {}

  Object.defineProperties(InternalQuery.prototype, {
    [SCHEMA]: defineProperty(schema),
    [CONNECTOR]: defineProperty(connector),
    [QUERY]: defineProperty([]),
    [UPDATE]: defineProperty([]),
    [SORT]: defineProperty([]),
    [SELECT]: defineProperty(selectBaseFactory()),
    [MODEL]: defineProperty(model),
  });

  const connectorQueryOptions = {
    schema,
    ParentQuery: InternalQuery,
  };
  const ConnectorQuery = connector.queryFactory(connectorQueryOptions);


  return ConnectorQuery;
};

module.exports = queryFactory;
