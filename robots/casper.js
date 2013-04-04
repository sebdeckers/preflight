'use strict';

var werker = require('werker');
var Spooky = require('spooky');
var URI = require('URIjs');

var scan = function (target, options, done) {
	console.log('Scanning:', target.url);
	var spooky = new Spooky({
		child: {
			transport: 'http'
		},
		casper: {
			logLevel: 'debug',
			verbose: false
		}
	}, function (error) {
		if (error) {
			return;
		}

		spooky.on('error', function (error) {
			done({
				error: {
					code: error.code,
					message: error.message
				},
				// url: (new URI(spooky.location.href)).toString(),
				// status: browser.statusCode
			});
		});

		// spooky.on('console', function (line) {
		// 	console.log(line);
		// });

		// spooky.on('log', function (log) {
		// 	if (log.space === 'phantom') {
		// 		console.log(log.message.replace(/ \- .*/, ''));
		// 	}
		// });

		// spooky.on('log', function (log) {
		// 	if (log.space === 'remote') {
		// 		console.log(log.message.replace(/ \- .*/, ''));
		// 	}
		// });

		spooky.start(target.url);

		// spooky.thenEvaluate(function () {
		// 	console.log('Hello, from', document.title);
		// });

		// spooky.then(function () {
		// 	// this.echo('Now, let me write something');
		// 	// done(null, {
		// 	// 	// url: url.toString(),
		// 	// 	// status: browser.statusCode,
		// 	// 	warnings: [],
		// 	// 	// links: links,
		// 	// 	// assets: assets,
		// 	// 	// timing: Date.now() - timer
		// 	// });
		// });

		spooky.on('run.complete', function () {
			done(null, {
				// url: url.toString(),
				// status: browser.statusCode,
				warnings: [],
				// links: links,
				// assets: assets,
				// timing: Date.now() - timer
			});
		});

		spooky.on('exit', function () {
			console.log('exitexitexitexitexitexitexit', this);
		});

		spooky.run();

	});
};

module.exports = werker.worker().method('scan', scan, true).start();
