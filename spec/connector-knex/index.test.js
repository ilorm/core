const fixtures = require('ilorm-connector-knex/spec/starWars.fixture');
const TestContext = require('ilorm-connector-knex/spec/helpers');

const testCommon = require('../common/query/number');

testCommon(TestContext, fixtures);

