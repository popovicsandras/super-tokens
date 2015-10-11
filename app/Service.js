'use strict';

var http = require('http');
var express = require('express');
var AdminRouter = require('./router/AdminRouter');

//var swaggerUiMiddleware = require('swagger-ui-middleware');

function Service(apis) {
    apis = apis || {};
    this.adminRouter = new AdminRouter();

}

Service.prototype = {

    start: function(port) {
        var app = express();

        this.adminRouter.init();

        app.use('/admin',this.adminRouter.getRouter());

        var server = http.createServer(app);
        server.listen(port, function() {
            console.log('Service started on port ' + port);
        });

        return server;
    }


};

module.exports = Service;
