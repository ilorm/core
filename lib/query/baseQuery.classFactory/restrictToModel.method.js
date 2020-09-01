'use strict';

const relationshipFactory = require('../../model/relation.classFactory');
const { MODEL, } = require('../../constants').QUERY.FIELDS;

function complexQuery(query, handler) {
  // restrict by ID / instance => easy
  // restrict by Query => hard
  // 1 <=> 1 query (join easy) or stream of apply
  // multiple restrict => SHIT
  // stream > stream > stream (seems hard) ? use reduce ?

  // Apply restrict by ID / instance first after;

  const streamArray = [
    {
      stream: null,
      instance: null,
    },
  ];

  streamArray[0].value = stream.read();

  let streamIndex = 1;

  while (streamArray[0].value !== null) {
    if (streamIndex < streamArray.length) {
      streamArray[streamIndex].instance = streamArray[streamIndex].stream.read();

      if (streamArray[streamIndex].instance === null) {
        streamIndex--;

        return;
      }

      streamIndex++;

      return;
    }

    // Apply query with every value
    streamArray.forEach(({ instance, }) => {
      // for every property;
      query[property[0].left] = instance[property[0].right];
    });
    // Need to handle it with a .and ?? To avoid property erasing property (seems a bad practice BUT)
    handler();

    streamIndex--;
  }
}

/**
 * Create the restrictToModel method from the query
 * @param {BaseQuery} query to use as base for the function.
 * @param {Ilorm} ilorm The ilorm context
 * @returns {Function} Return the restrictToModel method
 */
const restrictToModelMethod = (query, ilorm) => {
  const relationship = relationshipFactory(ilorm);

  return (relatedModel) => {
    const relatedModelList = [].concat(relatedModel);

    const reference = relationship.getRelation({
      modelReference: relatedModelList[0].constructor.getName(),
      modelSource: query[MODEL].getName(),
    });

    // Simple case of reference
    // Query.key = model.PrimaryKey
    if (reference.referenceB === relationship.Primary) {
      query[reference.referenceA].isIn(relatedModelList.map((relatedModel) => relatedModel.getPrimary()));

      return query;
    }

    if (reference.referenceA === relationship.Primary) {
      // Another simple case
      // Query.PrimaryKey = model.reference
      query.restrictToPrimary(relatedModelList.map((relatedModel) => relatedModel[reference.referenceB]));

      return query;
    }

    query[reference.referenceA].isIn(relatedModelList.map((relatedModel) => relatedModel[reference.referenceB]));

    return query;
  };
};

module.exports = restrictToModelMethod;
