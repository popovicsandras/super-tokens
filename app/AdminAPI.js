'use strict';

function AdminAPI(){
	

}

AdminAPI.prototype = {

	healthcheck: function(){
		return 'healthcheck';
	},

	tokens: function(){
		return 'tokens';
	},

	version: function(){
		return 'version';
	}

};

module.exports = AdminAPI;