'use strict';

var preflight = require('..');

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

exports.preflight = {
	setUp: function (done) {
		done();
	},
	'Site is up': function (test) {
		test.expect(1);
		preflight('http://localhost:7357/')
		.then(function (report) {
			test.equal(report.targets[0].status, 200);
		})
		.fin(test.done);
	},
	'Site is down': function (test) {
		test.expect(1);
		preflight('https://localhost:7357/')
		.fail(function (report) {
			test.equal(report.targets[0].error.code, 'ECONNRESET');
		})
		.fin(test.done);
	},
	'Page not found': function (test) {
		test.expect(1);
		preflight('http://localhost:7357/does_not_exist.html')
		.fail(function (report) {
			test.equal(report.targets[0].status, 404);
		})
		.fin(test.done);
	},
	'Detect missing image': function (test) {
		test.expect(1);
		preflight('http://localhost:7357/missing_image.html')
		.fail(function (report) {
			// test.equal(browser.error, 'TODO');
			test.equal(report.targets[0].assets[0].status, 404);
		})
		.fin(test.done);
	},
	'Detect missing external script': function (test) {
		test.expect(1);
		preflight('http://localhost:7357/missing_script.html')
		.fail(function (report) {
			// test.equal(browser.error.message, 'Unexpected identifier');
			test.equal(
				report.targets[0].error.message,
				'Unexpected identifier'
			);
		})
		.fin(test.done);
	},
	'Detect script error': function (test) {
		test.expect(1);
		preflight('http://localhost:7357/script_error.html')
		.fail(function (report) {
			// test.equal(browser.error.message, 'foo is not defined');
			test.equal(report.targets[0].error.message, 'foo is not defined');
		})
		.fin(test.done);
	},
	'Follow internal links': function (test) {
		test.expect(2);
		preflight('http://localhost:7357/internal_link.html')
		.then(function (report) {
			var hasUrl = function (href) {
				return function (target) {
					return target.url === href;
				};
			};
			// test.equal(browser.location.pathname, '/index.html');
			test.ok(report.targets.some(hasUrl('/internal_link.html')));
			test.ok(report.targets.some(hasUrl('/index.html')));
		})
		.fin(test.done);
	},
	'Find broken links': function (test) {
		test.expect(1);
		preflight('http://localhost:7357/broken_link.html')
		.fail(function (report) {
			// test.ok(report);
			test.equals(report.targets[0].status, 404);
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
