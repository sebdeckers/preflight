'use strict';
/*jshint newcap:false */

var Q = require('q');
var _ = require('underscore');
var Browser = require('zombie');

var browserOptions = {
	loadTimeout: 10 * 1000,
	clickTimeout: 5 * 1000,
	interactiveElements: ['a[href]', 'button'],
	followInternalLinks: false,
	followExternalLinks: false,
	networkLog: undefined
};

var internalOptions = {
	// debug: true,
	runScripts: true,
	silent: false
};

/*
var externalOptions = {
	debug: false,
	loadCSS: false,
	runScripts: false,
	silent: true
};
*/

var checkPage = function (browser, options, visited) {
	var promises = [];
	visited[browser.location.href] = true;

	if (browser.error) {
		throw new Error(browser);
	}

	if (options.followInternalLinks) {
		// for each link run checkPage with a cloned browser
		// and wait for their promises to resolve
		throw new Error('Link crawling not yet supported');
	}

	return promises.length ? Q.all(promises) : browser;
};

var Preflight = function (url, options) {
	var deferred = Q.defer();
	var browser = new Browser(internalOptions);
	var visited = {};
	options = _.extend(browserOptions, options);

	browser.visit(url, function (error, browser) {
		if (browser.error) {
			deferred.reject(browser);
		} else {
			var result = Q.fcall(checkPage, browser, options, visited);
			deferred.resolve(result);
		}
	});

	return deferred.promise;
};

exports = module.exports = Preflight;
