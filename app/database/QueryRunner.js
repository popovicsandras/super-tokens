'use strict';

/** class QueryRunner */
class QueryRunner {
    constructor(client) {
        this.client = client;
        this.database = null;
    }

    getPromise(queryMethod) {
        return new Promise(this._run.bind(this, queryMethod));
    }

    /** @private */
    _run(queryMethod, resolve, reject) {
        var resolve = this._resolvePromise.bind(null, resolve),
            close = this._closeDatabase.bind(this);

        this._connect()
            .then(queryMethod)
            .then(resolve)
            .then(close)
            .catch(reject);
    }

    /** @private */
    _connect() {
        var self = this;
        return new Promise(function(resolve, reject) {
            self.client.connect()
                .then(function(database) {
                    self.database = database;
                    resolve(database)
                })
                .catch(function(error) {
                    reject(error);
                });
        }.bind(this));
    }

    /** @private */
    _resolvePromise(resolve, queryResults) {
        resolve(queryResults);
    }

    /** @private */
    _closeDatabase() {
        this.database.close();
    }
}

module.exports = QueryRunner;