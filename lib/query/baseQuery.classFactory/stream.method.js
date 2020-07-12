'use strict';

const { Readable, Transform, } = require('stream');

const { CONNECTOR, LINKED_WITH, MODEL, } = require('../../constants').QUERY.FIELDS;

const WAIT_TTL = 100;

/**
 * Stream used to restrict query to another query
 */
class LinkedStream extends Readable {
  /**
   * Create a LinkedStream object
   * @param {Query} query The query used as primary target
   * @param {Stream} filterStream Input stream of model which restrict query result
   */
  constructor({ query, filterStream, }) {
    super({
      objectMode: true,
    });

    this.filterStream = filterStream;
    this.query = query;

    this.filterStream.on('data', async filterModel => {
      this.currentFilterModel = filterModel;

      this.filterStream.pause();
      this.currentStream = await this.query.restrictToModel(this.currentFilterModel).stream();
    });

    this.filterStream.on('end', () => {
      this.filterStream = null;
    });
  }

  /**
   * Method required per Readable interface to create a valid Read stream
   * @returns {Promise} Return nothing really interesting
   * @private
   */
  _read() {
    if (!this.currentStream) {
      return new Promise(resolve => {
        setTimeout(() => resolve(this._read()), WAIT_TTL);
      });
    }
    const instance = this.currentStream.read();

    if (instance) {
      return this.push(instance);
    }

    if (this.filterStream === null) {
      return this.push(null);
    }

    this.filterStream.resume();
    this.currentStream = null;

    return this._read();
  }

  /**
   * Create a LinkedStream object
   * @param {Query} query The query used as primary target
   * @param {Stream} filterStream Input stream of model which restrict query result
   * @returns {LinkedStream} The created linked stream
   */
  static createLinkedStream({ query, filterStream, }) {
    return new LinkedStream({
      query,
      filterStream,
    });
  }
}

/**
 * Transform stream to instantiate instance from the db source stream
 */
class InstantiateStream extends Transform {
  /**
   * Defined by the model
   * @param {Query} query The model to instantiate per each database entry
   */
  constructor(query) {
    super({
      objectMode: true,
    });

    this.query = query;
  }

  /**
   * Transform method of the Transform stream, overload to instantiate model instance.
   * @param {Object} rawInstance the model from the database
   * @param {String} encoding The encoding of the database source
   * @param {Function} callback Function called back from the result database
   * @returns {void} Return nothing
   * @private
   */
  _transform(rawInstance, encoding, callback) {
    callback(null, this.query.applySelectBehaviorOnConnectorResult(rawInstance));
  }
}

/**
 * Create a stream method from the query instance
 * @param {QueryBase} query The query instance to use
 * @returns {Promise.<Stream>} The stream to use.
 */
const streamMethod = async query => {
  await query.prepareQuery();

  if (query[LINKED_WITH]) {
    const stream = await query[LINKED_WITH].stream();

    delete query[LINKED_WITH];

    const readStream = await LinkedStream.createLinkedStream({
      query,
      filterStream: stream,
    });

    return readStream
      .pipe(new InstantiateStream(query[MODEL]));
  }

  const rawStream = await query[CONNECTOR].stream(query);

  return rawStream
    .pipe(new InstantiateStream(query));
};

module.exports = streamMethod;
