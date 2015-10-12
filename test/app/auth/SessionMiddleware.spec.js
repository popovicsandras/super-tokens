/* global beforeEach, describe, it, expect, sinon */

'use strict';

var SessionMiddleware = require('../../../app/auth/SessionMiddleware');

describe('SessionMiddleware', function() {

    var config,
        cirrus,
        middleware;

    beforeEach(function() {
        config = {
            environment: 'xx'
        };
        cirrus = {
            currentUser: sinon.spy()
        };

        middleware = new SessionMiddleware(config, cirrus);
    });


    describe('install', function() {
        it('should invoke use on the app when installed', function() {
            // Arrange
            var app = {
                use: sinon.spy()
            };

            // Act
            middleware.install(app);

            // Assert
            expect(app.use).to.have.been.called;
        });
    });

    describe('filter', function() {
        var next,
            request,
            response;

        beforeEach(function() {
            request = {
                url: "",
                cookies: []
            };
            response = {};
            next = sinon.spy();
        });

        it('should return 400 if sessionid not found', function() {
            // Arrange
            response.sendStatus = sinon.spy();

            // Act
            middleware.filter(request, response);

            // Assert
            expect(response.sendStatus).calledWith(400);
            sinon.assert.notCalled(cirrus.currentUser);
        });

        it('should call cirrus if sessionid in the url', function() {
            // Arrange
            request.url = 'foo?sessionid=12345';

            // Act
            middleware.filter(request, response);

            // Assert
            expect(cirrus.currentUser).calledWith('12345');
        });

        it('should call cirrus if sessionid in the cookies', function() {
            // Arrange
            request.cookies['xx_session_id'] = '56789';

            // Act
            middleware.filter(request, response);

            // Assert
            expect(cirrus.currentUser).calledWith('56789');
        });

        it('should return 401 if sessionid not resolved by Cirrus', function() {
            // Arrange
            response.sendStatus = sinon.spy();
            request.cookies['xx_session_id'] = 'xyz';

            // Act
            middleware.filter(request, response);
            simulateCirrusFailure();

            // Assert
            expect(response.sendStatus).calledWith(401);
        });

        it('should push the user in the request if sessionid is resolved by Cirrus', function() {
            // Arrange
            var user = {uuid:'99999999'}
            request.cookies['xx_session_id'] = 'xyz';

            // Act
            middleware.filter(request, response, next);
            simulateCirrusSuccess(user);

            // Assert
            expect(request.user).to.equal(user);
        });

        it('should call next if sessionid is resolved by Cirrus', function() {
            // Arrange
            var user = {uuid:'99999999'}
            request.cookies['xx_session_id'] = 'xyz';

            // Act
            middleware.filter(request, response, next);
            simulateCirrusSuccess(user);

            // Assert
            sinon.assert.called(next);
        });

        var simulateCirrusFailure = function() {
            var onFailure = cirrus.currentUser.firstCall.args[2];
            onFailure();
        }

        var simulateCirrusSuccess = function(result) {
            var onSuccess = cirrus.currentUser.firstCall.args[1];
            onSuccess(result);
        }

    });
});


