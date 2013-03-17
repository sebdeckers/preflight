'use strict';

var Q = require('q');
var _ = require('underscore');
var werker = require('werker');

var pool = werker.pool(__dirname + '/lib/robot.js')
		.max(5)
		.ttl(5000);

var browserOptions = {
	loadTimeout: 10 * 1000,
	clickTimeout: 5 * 1000,
	interactiveElements: ['a[href]', 'button'],
	followInternalLinks: false,
	followExternalLinks: false,
	networkLog: undefined
};

var scanTargets = function (targets, options) {
	var promises = targets.map(function scanUrl (target) {
		var deferred = Q.defer();
		pool.worker().scan(target, options, function (error, report) {
			if (error) {
				deferred.reject([error]);
			} else {
				if (report.targets && report.targets.length) {
					var promises = report.targets.map(scanUrl);
					Q.allResolved(promises).then(function (reports) {
						reports.unshift(report);
						deferred.resolve(reports);
					});
				} else {
					deferred.resolve([report]);
				}
			}
		});
		return deferred.promise;
	});
	return Q.allResolved(promises);
};

var Preflight = function (targets, options, callback) {
	var deferred = Q.defer();

	if (arguments.length === 2 && _.isFunction(options)) {
		callback = options;
		options = {};
	}

	if (_.isString(targets)) {
		targets = [{url: targets}];
	}

	if (_.isFunction(callback)) {
		deferred.promise.then(function (report) {
			callback(null, report);
		});
	}

	options = _.extend({}, browserOptions, options);

	scanTargets(targets, options).then(function (promises) {
		var isRejected = function (promise) {
			return promise.isRejected();
		};
		var getFulfillment = function (promise) {
			var fulfillment = promise.valueOf();
			return promise.isRejected() ?
				fulfillment.exception :
				fulfillment;
		};

		var state = _.any(promises, isRejected) ? 'reject' : 'resolve';
		var reports = _.chain(promises)
				.map(getFulfillment)
				.flatten()
				.value();

		deferred[state]({
			targets: reports
		});
	});

	return deferred.promise;
};

exports = module.exports = Preflight;
