/* global beforeEach, describe, it, expect, sinon */


'use strict';

var Cleaner = require('../../app/Cleaner');
var Tokens = require('../../app/api/Tokens');
var PeriodicRunner = require('../../app/PeriodicRunner');

describe('Cleaner', function() {

  describe('start', function() {

    it('asks the runner to execute the task', function() {

      var periodicRunner = new PeriodicRunner();
      var periodicRunnerSpy = sinon.spy(periodicRunner, 'start');
      var cleaner = new Cleaner(periodicRunner);

      var dayInMilliseconds = 1000 * 60 * 60 * 24;
      var taskStub = sinon.stub(cleaner, 'task');

      cleaner.start(1);

      expect(periodicRunnerSpy).to.have.been.calledWith(taskStub, dayInMilliseconds);

      taskStub.restore;
    });
  });

  describe('task', function() {
    it('asks the tokens to delete expired', function() {
      var tokens = new Tokens();
      var tokensSpy = sinon.spy(tokens, 'destroyExpired');
      var periodicRunner = new PeriodicRunner();
      var periodicRunnerSpy = sinon.spy(periodicRunner, 'start');

      var cleaner = new Cleaner(periodicRunner, tokens);

      cleaner.task();

      expect(tokensSpy).to.have.been.called; 

      expect()
    });
  });
});