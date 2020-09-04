const operationCount = require('./operations/count');
const operationFind = require('./operations/find');
const operationRemove = require('./operations/remove');
const operationStream = require('./operations/stream');
const operationUpdate = require('./operations/update');
const operationUpdateOne = require('./operations/updateOne');

const queryNumber = require('./query/number');
const queryOr = require('./query/or');
const queryPagination = require('./query/pagination');
const querySelect = require('./query/select');
const querySorting = require('./query/sorting');

module.exports = (TestContext) => {
  operationCount(TestContext);
  operationFind(TestContext);
  operationRemove(TestContext);
  operationStream(TestContext);
  operationUpdate(TestContext);
  operationUpdateOne(TestContext);

  queryNumber(TestContext);
  queryOr(TestContext);
  queryPagination(TestContext);
  querySelect(TestContext);
  querySorting(TestContext);
};
