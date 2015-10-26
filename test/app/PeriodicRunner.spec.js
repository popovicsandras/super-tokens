/* global beforeEach, describe, it, expect, sinon */

'use strict';

var PeriodicRunner = require('../../app/PeriodicRunner');

describe('PeriodicRunner', function() {

  beforeEach(function() {
    this.clock = sinon.useFakeTimers();
  });

  afterEach(function() {
    this.clock.restore();
  });

  describe('start', function() {

    it('runs a peridic task', function() {
      // Arrange
      var periodicRunner = new PeriodicRunner();
      var task = sinon.spy();
      var interval = 1;

      // Act
      periodicRunner.start(task, interval);
      this.clock.tick(interval);

      // Expect
      expect(task).to.have.been.called;

      // Teardown
      periodicRunner.stop();


    });

    it('should work', function() {
        expect(true).to.be.true;
    });


  });
});