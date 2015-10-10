/* global beforeEach, describe, it, expect, sinon */

'use strict';

var Tokens = require('../../app/Tokens'),
    MongoClient = require('../../app/database/SuperTokensMongoClient');

describe('Tokens', function() {

    var collection,
        database,
        client,
        tokens,
        activeTokenDocuments,
        userUuid;

    describe('findActive', function() {

        before(function() {
            userUuid = 12345;
            activeTokenDocuments = [1,2,3,4];
        });

        beforeEach(function() {
            collection = {
                find: function() { return this; },
                toArray: function() {
                    return Promise.resolve(activeTokenDocuments);
                }
            };
            database = {
                close: function(){},
                collection: function() { return collection; }
            };
            client = new MongoClient();

            sinon.stub(client, 'connect', function() {
                return Promise.resolve(database);
            });
        });

        it('should open and close db connection', function(done) {

            // Arrange
            sinon.spy(database, 'close');
            tokens = new Tokens(client);

            // Act
            tokens.findActive(userUuid);

            // Assert
            expect(client.connect).to.have.been.calledOnce;

            setImmediate(function() {
                expect(database.close).to.have.been.calledOnce;
                done();
            });
        });

        it('should call the database\'s find method with the passed uuid and the current date', function (done) {

            // Arrange
            var nowTimeStamp = 999,
                clock = sinon.useFakeTimers(nowTimeStamp, "Date");

            sinon.spy(collection, 'find');
            tokens = new Tokens(client);

            // Act
            tokens.findActive(userUuid);

            // Assert
            setImmediate(function() {
                expect(collection.find).to.have.been.calledWith({
                    useruuid: 12345,
                    expirydate: {
                        $gt: nowTimeStamp
                    }
                });
                clock.restore();
                done();
            });
        });

        it('should return a promise which will be fullfilled with the results', function (done) {

            // Arrange
            tokens = new Tokens(client);

            // Act
            tokens.findActive(userUuid)
                .then(function(documents) {
                    // Assert
                    expect(documents).to.be.eql(activeTokenDocuments);
                    done();
                });

        });

        it('should catch the thrown error', function (done) {

            // Arrange
            tokens = new Tokens(client);
            collection.find = function() {
                throw new Error('Find error');
            };

            // Act
            tokens.findActive(userUuid)
                .catch(function(error) {
                    // Assert
                    expect(error.message).to.be.equal('Find error');
                    done();
                });
        });
    });
});
