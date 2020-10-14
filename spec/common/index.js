const TEST_DEFAULT_CONFIG = require('./config');

/* eslint-disable global-require */
const TESTS = {
  base: {
    model: require('./base/model'),
    modelId: require('./base/modelId'),
  },
  operations: {
    count: require('./operations/count'),
    find: require('./operations/find'),
    remove: require('./operations/remove'),
    stream: require('./operations/stream'),
    update: require('./operations/update'),
    updateOne: require('./operations/updateOne'),
  },
  query: {
    linkedWith: require('./query/linkedWith'),
    number: require('./query/number'),
    or: require('./query/or'),
    pagination: require('./query/pagination'),
    select: require('./query/select'),
    sorting: require('./query/sorting'),
  },
  extra: {
    transaction: require('./extra/transaction'),
  },
};


module.exports = (TestContext, config = TEST_DEFAULT_CONFIG) => {
  for (const category of Object.keys(config)) {
    for (const key of Object.keys(config[category])) {
      if (config[category][key]) {
        TESTS[category][key](TestContext);
      }
    }
  }
};

