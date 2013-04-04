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

var checkReport = function (callback) {
	return function (promises) {
		var isRejected = function (promise) {
			return promise.isRejected();
		};
		var getFulfillment = function (promise) {
			var fulfillment = promise.valueOf();
			return promise.isRejected() ?
				fulfillment.exception :
				fulfillment;
		};

		var state = promises.some(isRejected) ? 'reject' : 'resolve';

		var endpoints = _.chain(promises)
				.map(getFulfillment)
				.flatten()
				.value();

		callback(state, {
			endpoints: endpoints
		});
	};
};

var scanTargets = function (links, options) {
	var scanUrl = function (link, options) {
		var deferred = Q.defer();
		pool.worker().scan(link, options, function (error, endpoint) {
			if (error) {
				deferred.reject([error]);
			} else {
				if (endpoint.links && endpoint.links.length) {
					scanTargets(endpoint.links, options)
					.then(checkReport(function (state, report) {
						var endpoints = [endpoint].concat(report.endpoints);
						deferred[state](endpoints);
					}));
				} else {
					deferred.resolve([endpoint]);
				}
			}
		});
		return deferred.promise;
	};
	var promises = links.map(function (link) {
		return scanUrl(link, options);
	});
	return Q.allResolved(promises);
};

var Preflight = function (links, options, callback) {
	var deferred = Q.defer();

	if (arguments.length === 2 && _.isFunction(options)) {
		callback = options;
		options = {};
	}

	if (_.isString(links)) {
		links = [{url: links}];
	}

	if (_.isFunction(callback)) {
		deferred.promise.then(function (report) {
			callback(null, report);
		});
	}

	options = _.extend({}, browserOptions, options);

	scanTargets(links, options)
	.then(checkReport(function (state, report) {
		deferred[state](report);
	}));

	return deferred.promise;
};

exports = module.exports = Preflight;
