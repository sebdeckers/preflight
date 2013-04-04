'use strict';

var preflight = require('./..');
var _ = require('underscore');

/*
	======== A Handy Little Nodeunit Reference ========
	https://github.com/caolan/nodeunit

	Test methods:
		test.expect(numAssertions)
		test.done()
	Test assertions:
		test.ok(value, [message])
		test.equal(actual, expected, [message])
		test.notEqual(actual, expected, [message])
		test.deepEqual(actual, expected, [message])
		test.notDeepEqual(actual, expected, [message])
		test.strictEqual(actual, expected, [message])
		test.notStrictEqual(actual, expected, [message])
		test.throws(block, [error], [message])
		test.doesNotThrow(block, [error], [message])
		test.ifError(value)
*/

var getEndpoint = function (report, href) {
	return _.find(report.endpoints, function (endpoint) {
		return endpoint.url === href;
	});
};

exports.preflight = {
	setUp: function (done) {
		done();
	},
	'Site is up': function (test) {
		test.expect(1);
		preflight('http://localhost:7357/')
		.then(function (report) {
			test.equal(report.endpoints[0].status, 200);
		})
		.fin(test.done);
	},
	'Site is down': function (test) {
		test.expect(1);
		preflight('https://localhost:7357/')
		.fail(function (report) {
			test.equal(report.endpoints[0].error.code, 'ECONNRESET');
		})
		.fin(test.done);
	},
	'Page not found': function (test) {
		test.expect(1);
		preflight('http://localhost:7357/does_not_exist.html')
		.fail(function (report) {
			test.equal(report.endpoints[0].status, 404);
		})
		.fin(test.done);
	},
	'Detect missing image': function (test) {
		test.expect(1);
		preflight('http://localhost:7357/missing_image.html')
		.fail(function (report) {
			test.equal(report.endpoints[0].assets[0].status, 404);
		})
		.fin(test.done);
	},
	'Detect missing external script': function (test) {
		test.expect(1);
		preflight('http://localhost:7357/missing_script.html')
		.fail(function (report) {
			test.equal(
				report.endpoints[0].error.message,
				'Unexpected identifier'
			);
		})
		.fin(test.done);
	},
	'Detect script error': function (test) {
		test.expect(1);
		preflight('http://localhost:7357/script_error.html')
		.fail(function (report) {
			test.equal(report.endpoints[0].error.message, 'foo is not defined');
		})
		.fin(test.done);
	},
	'Follow internal links': function (test) {
		test.expect(2);
		preflight('http://localhost:7357/internal_link.html')
		.then(function (report) {
			var target = 'http://localhost:7357/index.html';
			var endpoint = getEndpoint(report, target);
			test.ok(!!endpoint);
			test.equals(endpoint.status, 200);
		})
		.fin(test.done);
	},
	'Find broken links': function (test) {
		test.expect(2);
		preflight('http://localhost:7357/broken_link.html')
		.fail(function (report) {
			var target = 'http://localhost:7357/does_not_exist.html';
			var endpoint = getEndpoint(report, target);
			test.ok(!!endpoint);
			test.equals(endpoint.status, 404);
		})
		.fin(test.done);
	},
	'Callback syntax': function (test) {
		test.expect(1);
		preflight('http://localhost:7357/', function (error, report) {
			test.ok(report);
		})
		.fin(test.done);
	}
};
