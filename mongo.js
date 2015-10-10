var config = require('config');
var MongoClient = require('./app/database/SuperTokensMongoClient');
var Tokens = require('./app/Tokens');

var mongoClient = new MongoClient(config);
var tokens = new Tokens(mongoClient);

tokens.findActive(1)
    .then(function(docs) {
            console.log('then:', docs);
        })
    .catch(function(error) {
            console.log('catch: ', error);
        });