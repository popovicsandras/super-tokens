'use strict';
var mongo = require('mongodb');
var db = require('monk')('localhost/tokensdb');

class Tokens {

    constructor(tokensCollection) {
        if (tokensCollection) {
            this.tokensCollection = tokensCollection;
        } else {
            this.tokensCollection = db.get('tokens');
        }
    }

    findAllTokensOfUser(userUuid) {
        var promise = this.tokensCollection.find({useruuid: userUuid});
        return promise;
    }

    findById(tokenID) {
        var promise = this.tokensCollection.findById(tokenID);
        return promise;
    }

    create(tokenData) {
        var promise = this.tokensCollection.insert(tokenData);
        return promise;
    }

    delete(tokenId) {
        var promise = this.tokensCollection.remove({
            _id: tokenId
        });
        return promise;
    }

}

module.exports = Tokens;