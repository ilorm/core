'use strict';

const baseFieldFactory = require('./baseField.classFactory');
const booleanFieldFactory = require('./boolean.factory');
const dateFieldFactory = require('./date.factory');
const numberFieldFactory = require('./number.factory');
const stringFieldFactory = require('./string.factory');

module.exports = {
  baseFieldFactory,
  booleanFieldFactory,
  dateFieldFactory,
  numberFieldFactory,
  stringFieldFactory,
};

