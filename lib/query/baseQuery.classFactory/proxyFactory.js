'use strict';

const { SCHEMA, } = require('../../constants').QUERY.FIELDS;

/**
 * Create a proxy used to create dynamically properties of the model on the query.
 * @param {Object} query to overload
 * @returns {Proxy} The query with the proxy on it
 */
const proxyFactory = query => new Proxy(query, {
  get: (preQuery, propertyName, query) => {
    if (preQuery[propertyName] || typeof propertyName === 'symbol') {
      return preQuery[propertyName];
    }

    const propertyDefinition = query[SCHEMA].definition[propertyName];

    if (!propertyDefinition) {
      throw new Error(`The property ${propertyName.toString()} does not exists in the defined schema.`);
    }

    return propertyDefinition.getQueryOperations({
      query,
    });
  },
});

module.exports = proxyFactory;
