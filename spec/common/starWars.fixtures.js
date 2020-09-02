/**
 * Star wars fixtures are used by all common test
 */
class StarWarsFixtures {
  /**
   * Init the fixtures
   * @param {Function} idGenerator Function to generate id
   * @param {String} [idFieldName='id'] Default name of the id field in every schema
   */
  constructor({ idGenerator, idFieldName = 'id', }) {
    this.ID = {
      CHEWBACCA: idGenerator(),
      DARTH_VADOR: idGenerator(),
      LEIA: idGenerator(),
      LUKE: idGenerator(),

      RACE_HUMAN: idGenerator(),
      RACE_WOOKIE: idGenerator(),
    };
    this.idFieldName = idFieldName;

    Object.assign(this, this.getCharactersFixture(), { data: this.getData(), });
  }

  /**
   * Get declaration for create model
   * @param {Object} ilorm Inject ilorm for creating schema
   * @returns {Object} Return object to init model with
   */
  getData(ilorm) {
    return {
      characters: {
        name: 'characters',
        schema: this.getCharactersSchema(ilorm),
        connector: this.getCharactersConnector(),
      },
      races: {
        name: 'races',
        schema: this.getRacesSchema(ilorm),
        connector: this.getRacesConnector(),
      },
    };
  }

  /**
   * Inject ilorm and get schema associate with characters
   * @param {Object} ilorm Inject ilorm for creating schema
   * @returns {{raceId: (Field|*), gender: *, name: *, id: Field, weapons: *, height: (void|*)}} The schema
   */
  getCharactersSchema(ilorm) {
    const { Schema, } = ilorm;

    return {
      id: Schema.string().primary(),
      name: Schema.string(),
      raceId: Schema.string().reference({
        referencedModel: 'races',
        referencedField: 'id',
      }),
      height: Schema.number(),
      gender: Schema.string(),
      weapons: Schema.array(Schema.string()),
    };
  }

  /**
   * Inject ilorm and get schema associate with races
   * @param {Object} ilorm Inject ilorm for creating schema
   * @returns {{name: *, id: Field}} The schema
   */
  getRacesSchema(ilorm) {
    const { Schema, } = ilorm;

    return {
      id: Schema.string().primary(),
      name: Schema.string(),
    };
  }

  /**
   * Get connector associate with characters
   * @returns {Connector} Need to be overload by connector
   */
  getCharactersConnector() {
    throw new Error('Need to be overload for specific testing');
  }

  /**
   * Get connector associate with races
   * @returns {Connector} Need to be overload by connector
   */
  getRacesConnector() {
    throw new Error('Need to be overload for specific testing');
  }

  /**
   * Get raw data of characters to insert into database before test
   * @returns {Object} Data to insert into database
   */
  getCharactersFixture() {
    return {
      CHEWBACCA: {
        [this.idFieldName]: this.ID.CHEWBACCA,
        name: 'Chewbacca',
        gender: 'M',
        height: 230,
      },
      DARTH_VADOR: {
        [this.idFieldName]: this.ID.DARTH_VADOR,
        name: 'Darth Vador',
        gender: 'M',
        height: 203,
      },
      LEIA: {
        [this.idFieldName]: this.ID.LEIA,
        name: 'Leia Organa',
        gender: 'F',
        height: 150,
      },
      LUKE: {
        [this.idFieldName]: this.ID.LUKE,
        name: 'Luke Skywalker',
        gender: 'M',
        height: 172,
      },
    };
  }

  /**
   * Get raw data of races to insert into database before test
   * @returns {Object} Data to insert into database
   */
  getRaceFixture() {
    return {
      HUMAN: {
        id: this.ID.RACE_HUMAN,
        name: 'human',
      },
      WOOKIE: {
        id: this.ID.RACE_WOOKIE,
        name: 'wookie',
      },
    };
  }

}

module.exports = StarWarsFixtures;
