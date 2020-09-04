const Ilorm = require('../..').constructor;

/**
 * Class for managing init test / clean up after test.
 * manage fixtures
 */
class TestContext {
  /**
   * Init the test context by creating a dedicated ilorm instance
   * isolate from plugin, ...
   * @param {Object} fixtures data to be stored into database
   */
  constructor() {
    this.ilorm = new Ilorm();
    this.Models = {};
  }

  /**
   * Function called for every model in the given fixtures
   * @param {String} name The name of the Model
   * @param {Function} schemaFactory The Schema factory to generate the schema
   * @param {Connector} connector The connector to associate with the model
   * @returns {void} Return nothing
   */
  initModel({ name, schema, connector, }) {
    const modelConfig = {
      name,
      schema,
      connector,
    };

    this.Models[name] = this.ilorm.newModel(modelConfig);
  }


  /**
   * Function called for init database before every test (clean-up, insert fixtures)
   * @return {Promise} Resolve when finished
   */
  async initDb() {
    await this.fixtures.initDb();
    await this.initModels();
  }

  /**
   * Function called after every test for purge database
   * @return {Promise} Resolve when finished
   */
  cleanDb() {
    return this.fixtures.cleanDb();
  }

  /**
   * Init models of the context
   * @returns {void} Return nothing
   */
  initModels() {
    const data = this.fixtures.getData(this.ilorm);

    Object.keys(data).forEach((fixtureName) => this.initModel(data[fixtureName]));
  }
}

module.exports = TestContext;
