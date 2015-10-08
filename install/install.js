'use strict';

var MongoClient = require('mongodb').MongoClient,
    config = require('config'),
    test = require('assert');

function createDatabase(environment, config) {
    var connectionString = 'mongodb://' + config.db.host + ':' + config.db.port;
    MongoClient.connect(connectionString, function(err, db) {

        if (err !== null) {
            var message = `Connection to database for environment: "${environment}" failed. Does mongo running on: ${config.db.host}:${config.db.port}?`;
            console.log(message);
            return;
        }

        var tokensDb = db.db(config.db.name);

        tokensDb.createCollection('tokens', {capped:true, size:10000, max:1000, w:1}, function(err) {
            test.equal(null, err);
            console.log('Collection: tokens has been created in ' + config.db.name + ' database for environment: ' + environment);
            db.close();
        });
    });
}

createDatabase(process.env.NODE_ENV, config);