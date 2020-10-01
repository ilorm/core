const TestContext = require('ilorm-connector-knex/spec/testContext.class');

const testCommon = require('../common');

testCommon(TestContext, {
  query: {
    linkedWith: true,
  },
});

