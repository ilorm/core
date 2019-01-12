/* eslint-disable */
'use strict';

const expect = require('chai').expect;
const lib = require('./index');

describe('ilorm', () => {
  it('Should init with the good value', () => {
    expect(lib).to.be.a('object');
    expect(lib.Schema).to.be.a('function');
  });

});