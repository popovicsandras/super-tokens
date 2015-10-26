'use strict';
var PeriodicRunner = require('./PeriodicRunner');
var dayInMilliseconds = 1000 * 60 * 60 * 24;
var Tokens = require('./api/Tokens');


function Cleaner(periodicRunner, tokens) {
  if (periodicRunner) {
        this.periodicRunner = periodicRunner;
    }
    else {
        this.periodicRunner = new PeriodicRunner();
    }
  if (tokens) {
        this.tokens = tokens;
    }
    else {
        this.tokens = new Tokens();
    }
}

Cleaner.prototype = {
  
  start: function() {
    this.periodicRunner.start(this.task, dayInMilliseconds);
  },
  task: function() { 
    this.tokens.destroyExpired();
  },
};

module.exports = Cleaner;