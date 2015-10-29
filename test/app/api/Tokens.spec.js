/* global beforeEach, describe, it, expect, sinon */

'use strict';

var Tokens = require('../../../app/api/Tokens');

describe('Tokens', function() {

    var tokens,
        fakePromise;

    beforeEach(function() {
        var tokensCollection = {
            find: sinon.spy(),
            findById: sinon.spy(),
            insert: sinon.spy(),
            remove: sinon.spy()
        };

        tokens = new Tokens(tokensCollection);

    });

    it('should query the tokens collection in order to retrieve all the tokens created by the user ', function() {
        // Act
        tokens.findAllTokensOfUser(1111);

        // Assert
        expect(tokens.tokensCollection.find).to.have.been.calledWith({useruuid:1111});
    });

    it('should query the tokens collection in order to retrieve the info related to the requested token', function() {
        // Act
        tokens.findById(2222);

        // Assert
        expect(tokens.tokensCollection.findById).to.have.been.calledWith(2222);
    });

    it('should insert the new token in the collection', function() {
        // Act
        tokens.create({ content: 'mycontent', maxAge: 123456, type: 'passwordreset'});

        // Assert
        expect(tokens.tokensCollection.insert).to.have.been.calledWith({ content: 'mycontent', maxAge: 123456, type: 'passwordreset'});
    });


    it('should delete the token from the collection', function() {
        var tokenID = 1234;

        // Act
        tokens.delete(tokenID);

        // Assert
        expect(tokens.tokensCollection.remove).to.have.been.calledWith({_id: 1234});
    });

    it('should delete the expired tokens', function() {

        var dateSpy = sinon.stub(Date, 'now').returns(1445855465095)
        // Act
        tokens.destroyExpired();

        // Assert
        expect(tokens.tokensCollection.remove).to.have.been.calledWith({expiryDate: {$lt: 1445855465095}});
    });


    describe('Healthcheck', function() {

        beforeEach(function() {
            fakePromise = {
                successCallback: undefined,
                failureCallback: undefined,

                success: function(callback) {
                    this.successCallback = callback;
                },
                error: function(callback) {
                    this.errorCallback = callback;
                },

                resolve: function(context) {
                    if(this.successCallback) {
                        this.successCallback();
                    }
                },
                reject: function() {
                    var error = { message: 'I AM KO'};
                    if(this.errorCallback) {
                        this.errorCallback(error);
                    }
                }
            };

            var fakeTokensCollection = {
                find: function() {}
            };

            this.tokens = new Tokens(fakeTokensCollection);

        });


        it('should make a query to the tokens collection', function() {
            // Arrange
            var findStub = sinon.stub(this.tokens.tokensCollection, 'find', function() {
                return fakePromise;
            });

            // Act
            this.tokens.healthcheck();

            // Expect
            expect(findStub).to.have.been.calledWith({});

            // Teardown
            findStub.restore();

        });

        it('should solve the promise with a good healthy message if the query was successfull', function(done) {
            // Arrange
            var findStub = sinon.stub(this.tokens.tokensCollection, 'find', function() {
                return fakePromise;
            });

            this.tokens.healthcheck().then(function(successData) {
                expect(successData).to.be.eql({healthy: true, message: 'OK' });
                done();
            }, function(errorData) {
                done();
            });

            // Act
            fakePromise.resolve();

            // Teardown
            findStub.restore();
        });

        it('should reject the promise with a bad healthy message if the query was unsuccessfull', function(done) {
            // Arrange
            var findStub = sinon.stub(this.tokens.tokensCollection, 'find', function() {
                return fakePromise;
            });

            this.tokens.healthcheck().then(function(successData) {
                done();
            }, function(errorData) {
                expect(errorData).to.be.eql({healthy: false, message: 'I AM KO' });
                done();
            });

            // Act
            fakePromise.reject();

            // Teardown
            findStub.restore();
        });

    });


});