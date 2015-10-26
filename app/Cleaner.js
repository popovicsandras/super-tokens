'use strict';
var PeriodicRunner = require('./PeriodicRunner');
var dayInMilliseconds = 1000 * 60 * 60 * 24;
var Tokens = require('./api/Tokens');

var log = require('log4js-config').get('cleaner');

function Cleaner(periodicRunner, tokens) {
    if (periodicRunner) {
        this.periodicRunner = periodicRunner;
    } else {
        this.periodicRunner = new PeriodicRunner();
    }

    if (tokens) {
        this.tokens = tokens;
    } else {
        this.tokens = new Tokens();
    }
}

Cleaner.prototype = {

    start: function() {
        this.periodicRunner.start(this.task, dayInMilliseconds);
        log.debug('cleaner started!');
    },
    task: function() {
        this.tokens.destroyExpired();
        log.debug('Old tokens expired!');
    },
};

module.exports = Cleaner;