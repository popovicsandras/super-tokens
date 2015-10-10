'use strict';

var QueryRunner = require('./database/QueryRunner');

/** class Tokens */
class Tokens {

    constructor(client) {
        this.mongo = new QueryRunner(client);
    }

    findActive(userUuid) {
        var queryMethod = function queryMethod(database) {
            return database.collection('tokens')
                    .find({
                        useruuid: userUuid,
                        expirydate: {
                            $gt: Date.now()
                        }
                    }).toArray();
        };

        return this.mongo.getPromise(queryMethod);
    }
}

module.exports = Tokens;
