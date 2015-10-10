'use strict';

var PromisedMongo = require('./database/PromisedMongo');

/** class Tokens */
class Tokens {

    constructor(client) {
        this.mongo = new PromisedMongo(client);
    }

    findActive(userUuid) {
        var queryMethod = function queryMethod(database) {
            return database.find({
                useruuid: userUuid,
                expirydate: {
                    $gt: Date.now()
                }
            });
        };

        return this.mongo.getPromise(queryMethod);
    }
}

module.exports = Tokens;
