
/**
 * Inject dependencies in migration
 * @param {Ilorm} ilorm The ilorm linked with the Migration class
 * @returns {Migration} The Migration class bound with this ilorm instance
 */
function injectDependencies({ ilorm, }) {
  const migrationsIndex = [];

  /**
   * Migration class
   * class to manage migration of data
   */
  return class Migration {
    /**
     * Create a migration
     * @param {Number} timestamp The timestamp associate with this migration
     * @param {Schema} schema The schema bound with this migration
     * @param {Function} up Handler called to apply this migration
     * @param {Function} down Handler called to rollback this migration
     */
    constructor({ timestamp, schema, up, down, }) {
      this.time = timestamp;
      this.schema = schema;
      this.up = up;
      this.down = down;

      migrationsIndex.push(this);
      migrationsIndex.sort((migrationA, migrationB) => migrationA.time - migrationB.time);
    }

    /**
     * Apply this migration
     */
    up() {

    }

    /**
     * Rollback this migration
     */
    down() {

    }
  };
}

module.exports = injectDependencies;
