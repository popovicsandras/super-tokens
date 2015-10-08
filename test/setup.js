'use strict';

global.chai = require('chai');
global.should = require('chai').should();
global.expect = require('chai').expect;
global.assert = require('chai').assert;
global.AssertionError = require('chai').AssertionError;
global.sinon = require('sinon');

global.swallow = function (thrower) {
    try {
        thrower();
    } catch (e) { }
};

var sinonChai = require('sinon-chai');
global.chai.use(sinonChai);