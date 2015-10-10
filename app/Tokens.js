'use strict';

class Tokens {

    constructor(client) {
        this.client = client;
    }

    findActive(userUuid) {
        return new Promise(this._findActive.bind(this, userUuid));
    }

    _findActive(userUuid, resolve, reject) {
        this._connect()
            .then(this._queryActive.bind(this, userUuid))
            .then(this._resolvePromise.bind(this, resolve))
            .then(this._close)
            .catch(reject);
    }

    _queryActive(userUuid, database) {
        return database.find({
            useruuid: userUuid,
            expirydate: {
                $gt: Date.now()
            }
        });
    }

    _resolvePromise(resolve, promiseResults) {
        resolve(promiseResults.results);
        return promiseResults.database;
    }

    _connect() {
        return this.client.connect();
    }

    _close(database) {
        database.close();
    }
}

module.exports = Tokens;
