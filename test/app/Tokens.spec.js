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

    describe('findActiveTokens', function() {

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

            sinon.spy(client, 'connect');
            sinon.spy(database, 'close');
            sinon.spy(database, 'find');
        });

        it('should open and close db connection', function(done) {

            // Arrange
            tokens = new Tokens(client);

            // Act
            tokens.findActiveTokens(userUuid);

            // Assert
            expect(client.connect).to.have.been.calledOnce;

            setImmediate(function() {
                expect(database.close).to.have.been.calledOnce;
                done();
            });
        });

        it('should call the database\'s find method with the passed uuid', function (done) {

            // Arrange
            tokens = new Tokens(client);

            // Act
            tokens.findActiveTokens(userUuid);

            // Assert
            setImmediate(function() {
                expect(database.find).to.have.been.calledWith(12345);
                done();
            });
        });

        it('should return a promise which will be fullfilled with the results', function (done) {

            // Arrange
            tokens = new Tokens(client);

            // Act
            tokens.findActiveTokens(userUuid)
                .then(function(documents) {
                    // Assert
                    expect(documents).to.be.eql(activeTokenDocuments);
                    done();
                });

        });
    });
});
