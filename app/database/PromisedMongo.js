'use strict';

/** class PromisedMongo */
class PromisedMongo {
    constructor(client) {
        this.client = client;
    }

    getPromise(queryMethod) {
        return new Promise(this._run.bind(this, queryMethod));
    }

    /** @private */
    _run(queryMethod, resolve, reject) {
        var resolve = this._resolvePromise.bind(null, resolve),
            close = this._closeDatabase;

        this.client.connect()
            .then(queryMethod)
            .then(resolve)
            .then(close)
            .catch(reject);
    }

    /** @private */
    _resolvePromise(resolve, promiseResults) {
        resolve(promiseResults.results);
        return promiseResults.database;
    }

    /** @private */
    _closeDatabase(database) {
        database.close();
    }
}

module.exports = PromisedMongo;