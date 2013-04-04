'use strict';

var werker = require('werker');
var Browser = require('zombie');
var URI = require('URIjs');

var scan = function (target, options, done) {
	console.log('scanning', target.url);
	var browser = new Browser({
		debug: false,
		runScripts: true,
		silent: true
	});
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
	var timer = Date.now();
	browser.visit(target.url).then(function () {
		var url = new URI(browser.location.href);

		var links =
			browser.queryAll('a[href]')
			.map(function (elem) {
				return elem.getAttribute('href');
			})
			.map(function (href) {
				var target;
				try {
					target = (new URI(href))
						.absoluteTo(url)
						.fragment('')
						.toString();
				} catch (error) {
					target = '';
				}
				return target;
			})
			.filter(function (href) {
				return (href.length > 0) &&
					(!url.equals(href));
			})
			.map(function (href) {
				return {
					url: href,
					status: 0
				};
			});

		var assets = browser.resources
			.filter(function (resource) {
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
