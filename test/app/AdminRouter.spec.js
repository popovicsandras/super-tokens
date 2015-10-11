/* global beforeEach, describe, it, expect, sinon */

var express=require('express');

'use strict';

var AdminRouter=require('../../app/router/AdminRouter');

describe('AdminRouter',function(){

	var adminRouter = new AdminRouter();

	it('should be initialised correctly', function(){

		var initSpy = sinon.spy(adminRouter,'init');

		adminRouter.init();

		expect(initSpy).to.have.been.calledWith();

	});

	it('should return a router instance',function(){

		var returnSpy=sinon.spy(adminRouter,'getRouter');

		var myNewRouter = adminRouter.getRouter();

		expect(returnSpy).to.have.been.calledWith();
		//expect(myNewRouter).to.be.instanceof(express);

	});

});
