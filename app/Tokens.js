'use strict';

class Tokens {

    constructor(client) {
        this.client = client;
    }

    findActiveTokens(userUuid) {
        //return new Promise(function(resolve, reject) {
        //    this._connect()
        //        .then(this._findActiveTokens.bind(this, userUuid))
        //        .then(this.resolvePromise.bind(this, resolve))
        //        .then(this._close)
        //        .catch(reject);
        //    }.bind(this)
        //);

        var promiseResolve,
            promiseReject,
            promise;

        promise = new Promise(function(resolve, reject) {
            promiseResolve = resolve;
            promiseReject = reject;
        });

        this._connect()
            .then(this._findActiveTokens.bind(this, userUuid))
            .then(this.resolvePromise.bind(this, promiseResolve))
            .then(this._close)
            .catch(promiseReject);

        return promise;
    }

    _findActiveTokens(userUuid, database) {
        return database.find(userUuid);
    }

    resolvePromise(resolve, promiseResults) {
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
