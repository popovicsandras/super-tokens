'use strict';
var mongo = require('mongodb');
var db = require('monk')('localhost/tokensdb');
var log = require('log4js-config').get('tokens.db');
var Q = require('q');

class Tokens {

    constructor(tokensCollection) {
        if (tokensCollection) {
            this.tokensCollection = tokensCollection;
        } else {
            this.tokensCollection = db.get('tokens');
        }
    }

    healthcheck() {
        var deferred = Q.defer();
        var promise = this.tokensCollection.find({});

        promise.success(function () {
            deferred.resolve({name: "tokens", healthy: true, message: 'OK'});
        });

        promise.error(function (error) {
            deferred.resolve({name: "tokens", healthy: false, message: error.message});
        });

        return deferred.promise;
    }

    findAllTokensOfUser(userUuid) {
        log.debug("going to find all tokens of user ", userUuid)
        var promise = this.tokensCollection.find({useruuid: userUuid});
        return promise;
    }

    findById(tokenId) {
        log.debug("going to find tokens ", tokenId)
        var promise = this.tokensCollection.findById(tokenId);
        return promise;
    }

    create(tokenData) {
        log.debug("going to create token ", tokenData)
        var promise = this.tokensCollection.insert(tokenData);
        return promise;
    }

    delete(tokenId) {
        log.debug("going to delete token ", tokenId)
        var promise = this.tokensCollection.remove({
            _id: tokenId
        });
        return promise;
    }

    destroyExpired() {
        log.debug("periodic cleaning on tokens happening!")
        this.tokensCollection.remove({expiryDate: {$lt: Date.now()}});
    }

}

module.exports = Tokens;