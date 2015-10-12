/* global beforeEach, describe, it, expect, sinon */

'use strict';

var Tokens = require('../../../app/api/Tokens');

describe('Tokens', function() {

    var tokens;

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


});