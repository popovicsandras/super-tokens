var config = require('config');
var MongoClient = require('./app/database/SuperTokensMongoClient');
var Tokens = require('./app/Tokens');

var mongoClient = new MongoClient(config);
mongoClient.connect()
    .then(function(database) {
        var tokens = new Tokens(database);

        tokens.findActive(1)
            .then(function(docs) {
                console.log('then:', arguments);
            })
            .catch(function(error) {
                console.log('catch: ', error);
            });
    })
