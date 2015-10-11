var mongo = require('mongodb');
var db = require('monk')('localhost/tokensdb');

function TokensManager(tokensCollection) {
    if(tokensCollection) {
        this.tokensCollection = tokensCollection;
    } else {
        this.tokensCollection = db.get('tokens');
    }
}


TokensManager.prototype = {

    findAllTokensOfUser: function(userUuid) {
        var promise = this.tokensCollection.find({useruuid: userUuid});
        return promise;
    },

    findById: function(tokenID) {
        var promise = this.tokensCollection.findById(tokenID);
        return promise;
    },

    create: function(tokenData) {
        var promise = this.tokensCollection.insert(tokenData);
        return promise;
    },

    delete: function(tokenId) {
        var promise = this.tokensCollection.remove({
            _id: tokenId
        });
        return promise;
    }

};

module.exports = TokensManager;