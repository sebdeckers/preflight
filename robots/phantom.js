'use strict';

var werker = require('werker');
var phantom = require('node-phantom');
var URI = require('URIjs');

var scan = function (target, options, done) {
	console.log('Scanning:', target.url);

	var reportError = function (err, ph, page, status) {
		if (ph) {
			ph.exit();
		}
		done({
			error: {
				code: err.code,
				message: err.message
			},
			url: (new URI(target.url)).toString(),
			status: status || 0
		});
	};

	phantom.create(function (err, ph) {
		if (err) {
			return reportError(err, ph);
		}
		ph.createPage(function (err, page) {
			if (err) {
				return reportError(err, ph, page);
			}
			var timer = Date.now();
			page.open(target.url, function (err, status) {
				if (err) {
					return reportError(err, ph, page, status);
				}

				var baseUrl = new URI(target.url);

				page.evaluate(function () {
					return Array.prototype.slice.call(
							document.querySelectorAll('a[href]')
						)
						.map(function (elem) {
							return '' + elem.getAttribute('href');
						});
				}, function (err, result) {
					var links = (result || [])
						.map(function (href) {
							var target;
							try {
								target = (new URI(href))
									.absoluteTo(baseUrl)
									.fragment('')
									.toString();
							} catch (error) {
								target = '';
							}
							return target;
						}).filter(function (href) {
							return (href.length > 0) &&
								(!baseUrl.equals(href));
						}).map(function (href) {
							return {
								url: href,
								status: 0
							};
						});

					ph.exit();
					var assets = [];
					done(null, {
						url: baseUrl.toString(),
						status: status,
						warnings: [],
						links: links,
						assets: assets,
						timing: Date.now() - timer
					});
				});
			});
		});
	});
};

module.exports = werker.worker().method('scan', scan, true).start();
