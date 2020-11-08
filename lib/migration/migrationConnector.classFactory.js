/**
 * Inject dependencies to create MigrationConnector
 * @param {ilorm} ilorm Ilorm instance bound with the context
 * @param {Connector} Connector The connector linked with the Migration Connector
 * @returns {MigrationConnector} Return the MigrationConnector
 */
function injectDependencies({ ilorm, Connector, }) {
  const { Schema, newModel, } = ilorm;
  const migrationSchema = new Schema({
    appliedAt: Schema.date().default(() => Date.now()),
    version: Schema.string(),
  });
  const modelParams = {
    connector: new Connector({
      sourceName: 'ilormMigration',
    }),
    schema: migrationSchema,
  };

  /**
   * MigrationModel class
   * Model managed by ilorm to manage migration, only used if the user use migration system
   */
  class MigrationModel extends newModel(modelParams) {
    /**
     * Get last migration
     * @returns {MigrationModel} The last migration applied
     */
    getLastMigration() {
      return this.query()
        .appliedAt.useAsSortDesc()
        .findOne();
    }
  }

  /**
   * Manage all migration as a Connector level
   */
  return class MigrationConnector {

  };
}

module.exports = injectDependencies;
