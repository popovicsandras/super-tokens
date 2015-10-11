/* global beforeEach, describe, it, expect, sinon */

'use strict';

var Tokens = require('../../app/Tokens'),
    MongoClient = require('../../app/database/SuperTokensMongoClient');

describe('Tokens', function() {

    var collection,
        database,
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
                collection: function() { return collection; }
            };
        });

        it('should call the database\'s find method with the passed uuid and the current date', function (done) {

            // Arrange
            var nowTimeStamp = 999,
                clock = sinon.useFakeTimers(nowTimeStamp, "Date");

            sinon.spy(collection, 'find');
            tokens = new Tokens(database);

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
            tokens = new Tokens(database);

            // Act
            tokens.findActive(userUuid)
                .then(function(documents) {
                    // Assert
                    expect(documents).to.be.eql(activeTokenDocuments);
                    done();
                });

        });

        it('should catch the thrown error in toArray', function (done) {

            // Arrange
            tokens = new Tokens(database);
            collection.toArray = function() {
                return Promise.reject(new Error('Find error'));
            };

            // Act
            tokens.findActive(userUuid)
                .catch(function(error) {
                    // Assert
                    expect(error.message).to.be.equal('Find error');
                    done();
                });
        });

        it('should catch the thrown error in collection', function (done) {

            // Arrange
            tokens = new Tokens(database);
            database.collection = function() {
                throw new Error('Not existing collection');
            };

            // Act
            tokens.findActive(userUuid)
                .catch(function(error) {
                    // Assert
                    expect(error).to.be.not.undefined;
                    done();
                });
            process.nextTick(function() {});
        });
    });
});
