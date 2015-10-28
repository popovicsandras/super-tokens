/* global beforeEach, describe, it, expect, sinon */

'use strict';

var Cirrus = require('../../../app/auth/Cirrus');
var request = require('request');

describe('Cirrus', function() {

    var config,
        http,
        cirrus,
        _cirrus;

    beforeEach(function() {
        http = {};
        http.request = sinon.spy(function(){
            return {end: sinon.spy()};
        });

        config = {environment: 'yy'};
    
        cirrus = function() {
            if (_cirrus === undefined) {
                _cirrus = new Cirrus(config, http);
            }
            return _cirrus;
        }
    });

    afterEach(function() {
        _cirrus = undefined;
    });

    it('should invoke the expected host', function() {
        // Arrange
        config.environment='xx';

        // Act
        cirrus().currentUser();

        // Assert
        expect(http.request).calledWith(sinon.match({host: "xx.workshare.com"}));
    });


    it('should invoke the expected path', function() {
        // Arrange

        // Act
        cirrus().currentUser();

        // Assert
        expect(http.request).calledWith(sinon.match({path: "/api/v1.4/current_user.json"}));
    });


    it('should send the expected cookie', function() {
        // Arrange
        config.environment='xx';

        // Act
        cirrus().currentUser('12345');

        // Assert
        expect(http.request).calledWith(sinon.match({headers: {'Cookie': 'xx_session_id=12345'}}));
    });


    it('should invoke end on the request', function() {
        // Arrange
        var end = sinon.spy();
        http.request = sinon.spy(function(){
            return {end: end};
        });

        // Act
        cirrus().currentUser('12345');

        // Assert
        expect(end).called;
    });


    it('should invoke onSuccess when user returned', function() {
        // Arrange
        var onSuccess = sinon.spy(),
            onFailure = sinon.spy(),    
            user = {'uuid':"cafebabecafebabe"}

        // Act
        cirrus().currentUser('12345', onSuccess, onFailure);
        simulateHttpResponse(JSON.stringify(user));

        // Assert
        expect(onSuccess).calledWith(user);
        sinon.assert.notCalled(onFailure);
    });


    it('should invoke onFailure when receiving rubbish', function() {
        // Arrange
        var onSuccess = sinon.spy(),
            onFailure = sinon.spy();

        // Act
        cirrus().currentUser('12345', onSuccess, onFailure);
        simulateHttpResponse("some_rubbish");

        // Assert
        expect(onFailure).calledWith("some_rubbish");
        sinon.assert.notCalled(onSuccess);
    });

    describe('Healthcheck', function() {

        it('should invoke is_alive endpoint', function() {
            // Arrange
            var spyRequest = sinon.spy(request, 'get');

            // Act
            cirrus().healthcheck();

            // Assert
            expect(spyRequest).to.have.been.calledWith({ url: 'https://' + config.environment + '.workshare.com/is_alive',
                strictSSL: false});

            // Teardown
            spyRequest.restore();

        });

        it('should return a promise that when it has solved returns a successfull healthy status', function(done) {
            // Arrange
            var response = {
                statusCode: 200,
                statusMessage: 'OK'
            };

            // Sorry, but I'm learning - yields: causes the stub to call the first callback it receives with the provided arguments
            var stubRequest = sinon.stub(request, 'get').yields(null, response);

            // Act
            cirrus().healthcheck().then(function(data) {
                expect(data).to.be.eql({healthy: true, message: 'OK' });
                done();
            }, function(error) {
                done();
            });

            // Teardown
            stubRequest.restore();

        });

        it('should return a promise that when it has rejected returns an unhealthy status', function(done) {
            // Arrange
            var response = {
                statusCode: 200,
                statusMessage: 'OK'
            };
            var error = { message: 'I NEED HOLIDAYS - I AM KO'};

            var stubRequest = sinon.stub(request, 'get').yields(error, response);

            // Act
            cirrus().healthcheck().then(function(data) {
                done();
            }, function(error) {
                expect(error).to.be.eql({healthy: false, message: 'I NEED HOLIDAYS - I AM KO' });
                done();
            });

            // Teardown
            stubRequest.restore();

        });


    });




    var simulateHttpResponse = function(text) {
        var datacallbacks = [];
        var response = {on:function(what, back) {
            datacallbacks[what] = back;
        }};

        var maincallback = http.request.firstCall.args[1];
        maincallback(response);

        datacallbacks['data'](text);
        datacallbacks['end']();
    };
});