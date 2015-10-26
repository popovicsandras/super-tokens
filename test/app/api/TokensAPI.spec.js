/* global beforeEach, describe, it, expect, sinon */

'use strict';

var TokensAPI = require('../../../app/api/TokensAPI');

describe.skip('TokensAPI', function() {

    var tokensAPI,
        request,
        response,
        fakePromise;

    beforeEach(function() {
        var user = {
            uuid: 'fake-user-uuid'
        };

        tokensAPI = new TokensAPI();

        request = { params: {}, body: {}, user: {}};
        response = {
            json: sinon.spy(),
            status: sinon.spy()
        },
        fakePromise = {
            successCallback: undefined,

            failureCallback: undefined,

            success: function(callback) {
                this.successCallback = callback;
            },
            error: function(callback) {
                this.errorCallback = callback;
            },

            resolve: function() {
                var data = [{_id: "56177e04549220a3b38eb26e", content: "assHJJJJaaaa", type: "passwordreset", expirydate: "10-10-2014Z10:00", useruuid: "326776"}];
                if(this.successCallback) {
                    this.successCallback.apply(tokensAPI, [data]);
                }
            },
            reject: function() {
                var data = {error: 'something went wrong'};
                if(this.errorCallback) {
                    this.errorCallback.apply(tokensAPI, [data]);
                }
            }
        };

    });


    it('should respond with the user\'s tokens list', function() {
        // Arrange
        var stubFindAllTokensOfUser = sinon.stub(tokensAPI.tokens, 'findAllTokensOfUser', function() {
            return fakePromise;
        });

        request.user.uuid = '326776';

        var expectedResponse =[{_id: "56177e04549220a3b38eb26e", content: "assHJJJJaaaa", type: "passwordreset", expirydate: "10-10-2014Z10:00",useruuid: "326776"}];

        // Act
        tokensAPI.getAll(request, response);
        fakePromise.resolve();

        // Assert
        expect(stubFindAllTokensOfUser).to.have.been.calledWith('326776');
        expect(response.status).to.have.been.calledWith(200);
        expect(response.json).to.have.been.calledWith(expectedResponse);

        // Teardown
        stubFindAllTokensOfUser.restore();
    });

    it('should send an error if something went wrong while retrieving the user\'s tokens list', function() {
        // Arrange
        var stubFindAllTokensOfUser = sinon.stub(tokensAPI.tokens, 'findAllTokensOfUser', function() {
            return fakePromise;
        });

        request.user.uuid = '326776';

        // Act
        tokensAPI.getAll(request, response);
        fakePromise.reject();

        // Assert
        expect(response.status).to.have.been.calledWith(500);

        // Teardown
        stubFindAllTokensOfUser.restore();
    });


    it('should ask at the token manager to create a new token ', function() {
        // Arrange
        var stubCreate = sinon.stub(tokensAPI.tokens, 'create', function() {
            return fakePromise;
        });

        request.user.uuid = 1234;
        request.body.TokenRequest = {content:'xx',maxAge:1,type:'web'};

        // Act
        tokensAPI.create(request, response);
        fakePromise.resolve();

        // Assert
        expect(stubCreate).to.have.been.calledWith({content:'xx',maxAge:1,type:'web', useruuid: 1234 });

        // Teardown
        stubCreate.restore();
    });

    it('should send an error if the token manager is unable to create a new token', function() {
        // Arrange
        var stubCreate = sinon.stub(tokensAPI.tokens, 'create', function() {
            return fakePromise;
        });

        request.user.uuid = 1234;
        request.body.TokenRequest = {content:'xx',maxAge:1,type:'web'};

        // Act
        tokensAPI.create(request, response);
        fakePromise.reject();

        // Assert
        expect(stubCreate).to.have.been.calledWith({content:'xx',maxAge:1,type:'web', useruuid: 1234});
        expect(response.status).to.have.been.calledWith(500);

        // Teardown
        stubCreate.restore();
    });


    it('should ask at the token manager to delete a token given its id', function() {
        // Arrange
        var stubDelete = sinon.stub(tokensAPI.tokens, 'delete', function() {
            return fakePromise;
        });
        request.params.uuid = 1234;

        // Act
        tokensAPI.delete(request, response);
        //fakePromise.success(sinon.spy());

        // Assert
        expect(stubDelete).to.have.been.calledWith(1234);

        // Teardown
        stubDelete.restore();
    });

    it('should send an error if the token manager is unable to delete a token given its id', function() {
        // Arrange
        var stubDelete = sinon.stub(tokensAPI.tokens, 'delete', function() {
            return fakePromise;
        });
        request.params.uuid = 1234;

        // Act
        tokensAPI.delete(request, response);
        fakePromise.reject(sinon.spy());

        // Assert
        expect(response.status).to.have.been.calledWith(500);

        // Teardown
        stubDelete.restore();
    });

    describe('install', function() {

        var app;

        beforeEach(() => {
            app = {
                get: sinon.spy(),
                post: sinon.spy(),
                delete: sinon.spy()
            };
        });

        it('should attach endpoints', function() {

            // Act
            tokensAPI.install(app);

            // Assert
            expect(app.get).has.been.calledWith('/api/tokens');
            expect(app.get).has.been.calledWith('/api/tokens/:uuid');
            expect(app.post).has.been.calledWith('/api/tokens');
            expect(app.delete).has.been.calledWith('/api/tokens');
        });

        it('should attach methods to endpoints', function() {

            // Arrange
            tokensAPI.install(app);

            // Act
            var getAll = app.get.firstCall.args[1];
            var getOne = app.get.secondCall.args[1];
            var post = app.post.firstCall.args[1];
            var deleteCallback = app.delete.firstCall.args[1];

            // Assert
            expect(getAll.name).match(/getAll/);
            expect(getOne.name).match(/getById/);
            expect(post.name).match(/create/);
            expect(deleteCallback.name).match(/delete/);
        });
    });

});