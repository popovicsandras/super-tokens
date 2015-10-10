'use strict';

var MongoClient = require('mongodb').MongoClient;

/** @class SuperTokensMongoClient */
class SuperTokensMongoClient {

    constructor(config) {
        this.config = config;
        this.client = new MongoClient();
    }

    connect() {
        return this.client.connect(`mongodb://${this.config.db.host}:${this.config.db.port}/${this.config.db.name}`);
    }
}

module.exports = SuperTokensMongoClient;
