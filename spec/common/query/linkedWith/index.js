const parameters = require('./parameters');
const linkedWithQueryOperations = require('./linkedWithQueryOperations');

module.exports = (TestContext) => {
  parameters(TestContext);
  linkedWithQueryOperations(TestContext);
};
