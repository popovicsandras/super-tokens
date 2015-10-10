/* global beforeEach, describe, it, expect, sinon */

'use strict';

var Tokens = require('../../app/Tokens');

class Client {
    constructor(database) {
        this.database = database;
    }

    connect() {
        return Promise.resolve(this.database);
    }
}

class Database {
    constructor(documents) {
        this.documents = documents;
    }

    close() {}

    find() {
        return Promise.resolve({
            database: this,
            results: this.documents
        });
    }
}

describe('Tokens', function() {

    describe('findActive', function() {

        var database,
            client,
            tokens,
            activeTokenDocuments,
            userUuid;

        beforeEach(function() {
            userUuid = 12345;
            activeTokenDocuments = [1,2,3,4];
            database = new Database(activeTokenDocuments);
            client = new Client(database);
            tokens = new Tokens(client);

            sinon.spy(client, 'connect');
            sinon.spy(database, 'close');
            sinon.spy(database, 'find');
        });

        it('should open and close db connection', function(done) {

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

            // Act
            tokens.findActive(userUuid);

            // Assert
            setImmediate(function() {
                expect(database.find).to.have.been.calledWith({
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
            database.find = function() {
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
