const parameters = require('./parameters');
const linkedWithQueryOperations = require('./linkedWithQueryOperations');
const multipleLinkedWith = require('./multipleLinkedWith');

module.exports = (TestContext) => {
  parameters(TestContext);
  linkedWithQueryOperations(TestContext);
  multipleLinkedWith(TestContext);
};
