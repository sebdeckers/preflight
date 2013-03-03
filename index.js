'use strict';

var Q = require('Q');
var _ = require('underscore');
var Browser = require('zombie');

var browserOptions = {
	loadTimeout: 10 * 1000,
	clickTimeout: 5 * 1000,
	interactiveElements: ['a[href]', 'button'],
	followInternalLinks: true,
	followExternalLinks: true,
	networkLog: undefined
};

var internalOptions = {
	debug: false
};

/*
var externalOptions = {
	debug: false,
	loadCSS: false,
	runScripts: false,
	silent: true
};
*/

var Preflight = function (url, options) {
	var deferred = Q.defer();

	options = _.extend(browserOptions, options);
	var browser = new Browser({
		debug: true
	});

	browser.visit(url, internalOptions, function (error, browser) {
		if (browser.error) {
			this.errors = browser.errors;
			deferred.reject();
		} else {
			deferred.resolve({success: true});
		}
	});

	return deferred.promise;
};

exports = module.exports = Preflight;
