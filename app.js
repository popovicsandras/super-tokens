var Service = require('./app/Service');
var config = require('config');

new Service().start(config.get('port'));
