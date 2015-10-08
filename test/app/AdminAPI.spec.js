/* global beforeEach, describe, it, expect, sinon */
'use strict';

var AdminAPI = require('../../app/AdminAPI');

describe('adminAPI',function(){

	var adminAPI,
		message;

	beforeEach(function(){

		adminAPI = new AdminAPI();

	});

	it('returns a message when invoking healthCheck',function(){
		var healthcheckSpy = sinon.spy(adminAPI,'healthcheck');

		message = adminAPI.healthcheck();

		expect(healthcheckSpy).to.have.been.calledWith();
		expect(message).to.equal('healthcheck');

	});

	it('should return message when invoking tokens',function(){
		var tokenSpy = sinon.spy(adminAPI,'tokens');

		message = adminAPI.tokens();
		expect(tokenSpy).to.have.been.calledWith();
		expect(message).to.equal('tokens');
	});

	it('should return message when invoking version',function(){
		var versionSpy = sinon.spy(adminAPI,'version');

		message = adminAPI.version();
		expect(versionSpy).to.have.been.calledWith();
		expect(message).to.equal('version');
	});



});
