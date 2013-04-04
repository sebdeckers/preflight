'use strict';

var werker = require('werker');
var Browser = require('zombie');
var URI = require('URIjs');

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
	var timer = Date.now();
	var browser = new Browser(internalOptions);
	browser.on('error', function () {
		done({
			error: {
				code: browser.error.code,
				message: browser.error.message
			},
			url: (new URI(browser.location.href)).toString(),
			status: browser.statusCode
		});
	});
	browser.visit(target.url).then(function () {
		var url = new URI(browser.location.href);

		var links = browser.queryAll('a[href]').map(function (elem) {
				return elem.getAttribute('href');
			})
			.map(function (href) {
				var target = new URI(href);
				return {
					url: target.absoluteTo(url).toString(),
					status: 0
				};
			})
			.filter(function (link) {
				return !url.equals(link.url);
			});

		var assets = browser.resources.filter(function (resource) {
				return resource.request.method === 'GET';
			})
			.map(function (resource) {
				return {
					url: resource.request.url,
					status: 0,
					type: ''
				};
			});

		done(null, {
			url: url.toString(),
			status: browser.statusCode,
			warnings: [],
			links: links,
			assets: assets,
			timing: Date.now() - timer
		});
	});
};

module.exports = werker.worker().method('scan', scan, true).start();
