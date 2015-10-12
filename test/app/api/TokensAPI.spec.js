/* global beforeEach, describe, it, expect, sinon */

'use strict';

var TokensAPI = require('../../../app/api/TokensAPI');

describe('TokensAPI', function() {

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
        var stubFindAllTokensOfUser = sinon.stub(tokensAPI.tokensManager, 'findAllTokensOfUser', function() {
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
        var stubFindAllTokensOfUser = sinon.stub(tokensAPI.tokensManager, 'findAllTokensOfUser', function() {
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
        var stubCreate = sinon.stub(tokensAPI.tokensManager, 'create', function() {
            return fakePromise;
        });

        request.body.TokenRequest = {content:'xx',maxAge:1,type:'web'};

        // Act
        tokensAPI.create(request, response);
        fakePromise.success();

        // Assert
        expect(stubCreate).to.have.been.calledWith({content:'xx',maxAge:1,type:'web'});

        // Teardown
        stubCreate.restore();
    });

    it('should send an error if the token manager is unable to create a new token', function() {
        // Arrange
        var stubCreate = sinon.stub(tokensAPI.tokensManager, 'create', function() {
            return fakePromise;
        });

        request.body.TokenRequest = {content:'xx',maxAge:1,type:'web'};

        // Act
        tokensAPI.create(request, response);
        fakePromise.reject();

        // Assert
        expect(stubCreate).to.have.been.calledWith({content:'xx',maxAge:1,type:'web'});
        expect(response.status).to.have.been.calledWith(500);

        // Teardown
        stubCreate.restore();
    });


    it('should ask at the token manager to delete a token given its id', function() {
        // Arrange
        var stubDelete = sinon.stub(tokensAPI.tokensManager, 'delete', function() {
            return fakePromise;
        });
        request.params.uuid = 1234;

        // Act
        tokensAPI.delete(request, response);
        fakePromise.success();

        // Assert
        expect(stubDelete).to.have.been.calledWith(1234);

        // Teardown
        stubDelete.restore();
    });

    it('should send an error if the token manager is unable to delete a token given its id', function() {
        // Arrange
        var stubDelete = sinon.stub(tokensAPI.tokensManager, 'delete', function() {
            return fakePromise;
        });
        request.params.uuid = 1234;

        // Act
        tokensAPI.delete(request, response);
        fakePromise.reject();

        // Assert
        expect(response.status).to.have.been.calledWith(500);

        // Teardown
        stubDelete.restore();
    });

});