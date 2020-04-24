'use strict';

const baseField = require('./baseField.class');
const booleanFieldFactory = require('./boolean.factory');
const dateFieldFactory = require('./date.factory');
const numberFieldFactory = require('./number.factory');
const referenceFieldFactory = require('./reference.factory');
const stringFieldFactory = require('./string.factory');

module.exports = {
  baseField,
  booleanFieldFactory,
  dateFieldFactory,
  numberFieldFactory,
  referenceFieldFactory,
  stringFieldFactory,
};

