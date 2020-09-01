const operationCount = require('./operations/count');
const operationFind = require('./operations/find');
const operationRemove = require('./operations/remove');
const operationStream = require('./operations/stream');
const operationUpdate = require('./operations/update');

const queryNumber = require('./query/number');
const queryOr = require('./query/or');
const queryPagination = require('./query/pagination');
const querySelect = require('./query/select');
const querySorting = require('./query/sorting');

module.exports = (TestContext, fixtures) => {
  operationCount(TestContext, fixtures);
  operationFind(TestContext, fixtures);
  operationRemove(TestContext, fixtures);
  operationStream(TestContext, fixtures);
  operationUpdate(TestContext, fixtures);

  queryNumber(TestContext, fixtures);
  queryOr(TestContext, fixtures);
  queryPagination(TestContext, fixtures);
  querySelect(TestContext, fixtures);
  querySorting(TestContext, fixtures);
};

