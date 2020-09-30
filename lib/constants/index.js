'use strict';

const DATABASES = require('./databases');
const MODEL = require('./model');
const QUERY = require('./query');
const SCHEMA = require('./schema');
const FIELD = require('./field');

module.exports = {
  DATABASES,
  MODEL,
  MODEL_ID: {
    ID: Symbol('ID'),
    MODEL: Symbol('Model'),
  },
  QUERY,
  SCHEMA,
  FIELD,
};
