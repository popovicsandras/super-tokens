var express = require('express');
var VersionAPI = require('../api/VersionAPI');


function AdminRouter(){
	this.router = express.Router();
	this.versionAPI = new VersionAPI();
}

AdminRouter.prototype = {

	init: function(){

		this.router.get('/healthcheck', function(request,response){
			response.send('hc');
		});

        this.router.get('/version/', this.versionAPI.get);
	},

	getRouter: function(){
		return this.router;
	}
}

module.exports = AdminRouter;