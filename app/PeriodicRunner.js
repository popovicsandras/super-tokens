'use strict';

function PeriodicRunner() {
}

PeriodicRunner.prototype = {
  runner: undefined,
  start: function(task, interval) {
      this.runner = setInterval(task, interval);
    },
  stop: function() {
      clearInterval(this.runner);
  }
};

module.exports = PeriodicRunner;