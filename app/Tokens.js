'use strict';

function resolvePromise(resolve, promiseResults) {
    resolve(promiseResults.results);
    return promiseResults.database;
}

function closeDatabase(database) {
    database.close();
}

/** class Tokens */
class Tokens {

    constructor(client) {
        this.client = client;
    }

    findActive(userUuid) {
        var queryMethod = this._queryActive.bind(null, userUuid);
        return new Promise(this._runDbQuery.bind(this, queryMethod));
    }

    /** @private */
    _queryActive(userUuid, database) {
        return database.find({
            useruuid: userUuid,
            expirydate: {
                $gt: Date.now()
            }
        });
    }

    /** @private */
    _runDbQuery(queryMethod, resolve, reject) {

        var resolve = resolvePromise.bind(null, resolve);

        this.client.connect()
            .then(queryMethod)
            .then(resolve)
            .then(closeDatabase)
            .catch(reject);
    }
}

module.exports = Tokens;
