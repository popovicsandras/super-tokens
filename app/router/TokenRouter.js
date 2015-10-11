var express = require('express');

function AdminRouter(){
	this.router = express.Router();
}

AdminRouter.prototype = {

	init: function(){

		this.router.get('/healthcheck', function(request,response){
			response.send('hc');

		});

        this.router.get('/version', function(request,response){

        	response.send('version');
        });
		
	},

	getRouter: function(){

		return this.router;

	}
	

}

module.exports = AdminRouter;