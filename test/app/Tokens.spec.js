/* global beforeEach, describe, it, expect */

'use strict';

var Tokens = require('../../app/Tokens');

describe('Tokens', function() {

    describe('findActiveTokens', function() {

        var db,
            tokens;

        beforeEach(function() {
            db = {
                open: function() {},
                find: function() {},
                close: sinon.spy()
            };

            sinon.stub(db, 'open', function() {
                return Promise.resolve();
            });

            sinon.stub(db, 'find', function() {
                return Promise.resolve();
            });
        });

        it('should open and close db connection', function(done) {

            // Arrange
            tokens = new Tokens(db);

            // Act
            tokens.findActiveTokens(12345);

            // Assert
            expect(db.open).to.have.been.calledOnce;

            setImmediate(function() {
                expect(db.close).to.have.been.calledOnce;
                done();
            });
        });

        it('should call the database\'s find method with the passed uuid', function (done) {

            // Arrange
            tokens = new Tokens(db);

            // Act
            tokens.findActiveTokens(12345);

            // Assert
            setImmediate(function() {
                expect(db.find).to.have.been.calledWith(12345);
                done();
            });
        });

    });
});
