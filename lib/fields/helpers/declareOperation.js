'use strict';

const { FIELDS, } = require('../../constants').QUERY;

/**
 * Declare an operation linked with the query
 * @param {Object} query The query where the operation is declared
 * @param {Field} field The field linked with the operation
 * @param {String} operation The operation to apply
 * @param {String} [operationType=Query] The operationType to apply (QUERY or UPDATE)
 * @param {Field[]|Null} [ancestorFields=Null] For document database, handle field hierarchy
 * @param {Function} [castValue=field.castValue] Enforce the parameter is cast at the authorized field value
 * @returns {Function} Return a function to apply input to the given context
 */
const declareOperationFactory = ({
  query,
  field,
  operation,
  operationType = FIELDS.QUERY,
  ancestorFields = null,
  castValue = field.castValue,
}) => (

  /**
 * Apply the params on the given query field (key, operation).
 * @param {Object} params The params to apply
 * @returns {Object} Return the query item with the applied params
 */
  (params) => {
    query[operationType].push({
      field,
      operator: operation,
      value: castValue.bind(field)(params),
      ancestorFields,
    });

    return query;
  }
);

module.exports = declareOperationFactory;
