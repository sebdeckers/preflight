'use strict';

var werker = require('werker');
var Browser = require('zombie');
var _ = require('underscore');

var internalOptions = {
	debug: false,
	runScripts: true,
	silent: true
};

/*
var externalOptions = {
	debug: false,
	loadCSS: false,
	runScripts: false,
	silent: true
};
*/
/*
var checkPage = function (browser, options, visited) {
	if (browser.error) {
		throw new Error(browser);
	}

	var unavailable = function (resource) {
		return resource.response.statusCode !== 200;
	};
	if (_.any(browser.resources, unavailable)) {
		throw new Error(browser);
	}

	if (options.followInternalLinks) {
		// for each link run checkPage with a cloned browser
		// and wait for their promises to resolve
		throw new Error('Link crawling not yet supported');
	}
};
*/

var scan = function (target, options, done) {
	var browser = new Browser(internalOptions);
	browser.on('error', function () {
		done(_.extend({
			error: {
				code: browser.error.code,
				message: browser.error.message
			},
			status: browser.statusCode
		}, target));
	});
	browser.visit(target.url).then(function () {
		done(null, _.extend({
			status: browser.statusCode
		}, target));
	});
};

module.exports = werker.worker().method('scan', scan, true).start();
