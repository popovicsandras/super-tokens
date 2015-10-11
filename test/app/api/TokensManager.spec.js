/* global beforeEach, describe, it, expect, sinon */

'use strict';

var TokensManager = require('../../../app/api/TokensManager');

describe('TokensManager', function() {

    var tokensManager;

    beforeEach(function() {
        var tokensCollection = {
            find: sinon.spy(),
            findById: sinon.spy(),
            insert: sinon.spy(),
            remove: sinon.spy()
        };

        tokensManager = new TokensManager(tokensCollection);

    });

    it('should query the tokens collection in order to retrieve all the tokens created by the user ', function() {
        // Act
        tokensManager.findAllTokensOfUser(1111);

        // Assert
        expect(tokensManager.tokensCollection.find).to.have.been.calledWith({useruuid:1111});
    });

    it('should query the tokens collection in order to retrieve the info related to the requested token', function() {
        // Act
        tokensManager.findById(2222);

        // Assert
        expect(tokensManager.tokensCollection.findById).to.have.been.calledWith(2222);
    });

    it('should insert the new token in the collection', function() {
        // Act
        tokensManager.create({ content: 'mycontent', maxAge: 123456, type: 'passwordreset'});

        // Assert
        expect(tokensManager.tokensCollection.insert).to.have.been.calledWith({ content: 'mycontent', maxAge: 123456, type: 'passwordreset'});
    });


    it('should delete the token from the collection', function() {
        var tokenID = 1234;

        // Act
        tokensManager.delete(tokenID);

        // Assert
        expect(tokensManager.tokensCollection.remove).to.have.been.calledWith({_id: 1234});
    });


});