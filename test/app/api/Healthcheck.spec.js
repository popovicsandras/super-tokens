/* global beforeEach, describe, it, expect, sinon */

'use strict';

var Healthcheck = require('../../../app/api/Healthcheck');
var async = require('async');
var Q = require('q');

describe('Healthcheck', function() {

    var healthcheckAPI,
        config,
        request,
        response,
        cirrus,
        tokens,
        app;

    before(function() {
        config = {
            enviroment: 'test'

        };
        request = {};

        app = {
            get: sinon.spy()
        }

        cirrus = {
            healthcheck: function() {
                var deferred = Q.defer();
                deferred.resolve();
                return deferred.promise;
            }
        }

        tokens = {
            healthcheck: function() {
                var deferred = Q.defer();
                deferred.resolve();
                return deferred.promise;
            }
        }
        response = {
            send: sinon.spy(),
            status: sinon.spy()
        }
    });

    beforeEach(function() {
        healthcheckAPI = new Healthcheck(config, cirrus, tokens);
    });

    it('should execute in parallel async the healthcheck of cirrus and tokens', function() {
        // Arrange
        var runCirrusHealthcheckSpy = sinon.spy(healthcheckAPI,'runCirrusHealthcheck');
        var runTokensHealthcheckSpy = sinon.spy(healthcheckAPI, 'runTokensHealthcheck');
        var asyncSpy = sinon.spy(async, 'parallel');

        // Act
        healthcheckAPI.get(request, response);

        // Expect
        expect(runCirrusHealthcheckSpy).to.have.been.called;
        expect(runTokensHealthcheckSpy).to.have.been.called;
        expect(asyncSpy).to.have.been.called;

        // Teardown
        runCirrusHealthcheckSpy.restore();
        runTokensHealthcheckSpy.restore();
        asyncSpy.restore();

    });



    describe('runCirrusHealthcheck', function() {
        beforeEach(function () {
            var context = this;

            sinon.stub(process, 'nextTick').yields();

            this.healthcheckStub = sinon.stub(cirrus, 'healthcheck', function () {
                var deferred = Q.defer();
                context.promise = deferred;
                return deferred.promise;
            });
        });

        afterEach(function () {
            process.nextTick.restore();
            this.healthcheckStub.restore();
        });

        it('should call the healthcheck on cirrus ', function () {
            // Act
            healthcheckAPI.get(request, response);

            // Expect
            expect(this.healthcheckStub).to.have.been.called;
        });

        it('should call the callback with the cirrus health message', function() {
            // Arrange
            var callback = sinon.spy();

            // Act
            healthcheckAPI.runCirrusHealthcheck(callback);
            this.promise.resolve({foo: 'bar'});

            // Assert
            expect(callback).to.have.been.calledWith(null, {foo: 'bar'});

        });


        it('should call the callback with error if the cirrus healthcheck is not good', function() {
            // Arrange
            var callback = sinon.spy();

            // Act
            healthcheckAPI.runCirrusHealthcheck(callback);
            this.promise.reject({foo: 'bar' });

            // Assert
            expect(callback).to.have.been.calledWith({system: 'cirrus', foo: 'bar' });

        });

    });

    describe('runTokensHealthcheck', function() {

        beforeEach(function () {
            var context = this;
            sinon.stub(process, 'nextTick').yields();

            this.healthcheckStub = sinon.stub(tokens, 'healthcheck', function () {
                var deferred = Q.defer();
                context.promise = deferred;
                return deferred.promise;
            });
        });

        afterEach(function () {
            process.nextTick.restore();
            this.healthcheckStub.restore();
        });


        it('should call the healthcheck on tokens ', function () {
            // Act
            healthcheckAPI.get(request, response);

            // Expect
            expect(this.healthcheckStub).to.have.been.called;
        });

        it('should call the callback with success if the tokens healthcheck is good', function() {
            // Arrange
            var callback = sinon.spy();

            // Act
            healthcheckAPI.runTokensHealthcheck(callback);
            this.promise.resolve({foo: 'bar'});

            // Assert
            expect(callback).to.have.been.calledWith(null, {foo: 'bar'});
            expect(response.status).to.have.been.calledWith(200);

        });

        it('should call the callback with error if the tokens healthcheck is not good', function() {
            // Arrange
            var callback = sinon.spy();

            // Act
            healthcheckAPI.runTokensHealthcheck(callback);
            this.promise.reject({foo: 'bar'});

            // Assert
            expect(callback).to.have.been.calledWith({system: 'tokens', foo: 'bar'});
            expect(response.status).to.have.been.calledWith(400);

        });

    });


    it('should call the healthcheck on tokens', function () {
        // Arrange
        var spyHealthcheck = sinon.spy(tokens,'healthcheck');

        // Act
        healthcheckAPI.get(request, response);

        // Expect
        expect(spyHealthcheck).to.have.been.called;

        // Teardown
        spyHealthcheck.restore();

    });



    it('should respond with healthcheck json results', function() {
        // Arrange
        var cirrusStub = sinon.stub(healthcheckAPI,'runCirrusHealthcheck', function(callback) {
            callback.apply(null, [null,{healthy: true, message: 'OK'}]);
        });

        var tokensStub = sinon.stub(healthcheckAPI, 'runTokensHealthcheck', function(callback) {
            callback.apply(null, [null,{healthy: true, message: 'OK'}]);
        });

        // Act
        healthcheckAPI.get(request, response);

        // Assert
        expect(response.status).to.have.been.calledWith(200);
        expect(response.send).to.have.been.calledWith(sinon.match({ cirrus: { healthy: true, message: 'OK'}, tokens: {healthy: true, message: 'OK'}}));

        // Teardown
        cirrusStub.restore();
        tokensStub.restore();
    });


    it('should attach endpoints', function() {
        // Act
        healthcheckAPI.install(app);

        // Assert
        expect(app.get).has.been.calledWith('/admin/healthcheck');
    });

});
