'use strict';

const { Duplex, } = require('stream');

/**
 * DuplexStream linked with the model to fast insert data from an input stream or to read all data from the
 * linked database
 */
class MainStream extends Duplex {
  /**
   * Instantiate the stream
   * @param {Model} Model Linked model class
   */
  constructor({ Model, }) {
    super({
      objectMode: true,
    });

    this.Model = Model;
  }

  /**
   * Method to implement the write part of the stream
   * @param {Object} rawInstance The raw object to save
   * @param {String} encoding Unused, the chunk is an object
   * @param {Function} callback Called back when the function have finish
   * @return {Promise<void>} Resolve when finish
   * @private
   */
  async _write(rawInstance, encoding, callback) {
    const instance = new this.Model(rawInstance);

    await instance.save();
    callback();
  }

  /**
   * Method to implement the read part of the stream
   * @return {Promise<null>} Resolve when finish
   * @private
   */
  async _read() {
    if (!this.readStream) {
      this.readStream = await this.Model.query().stream();
    }

    let stopRead;

    do {
      stopRead = this.push(this.readStream.read());
    } while (stopRead !== false);

    return null;
  }
}

module.exports = MainStream;
