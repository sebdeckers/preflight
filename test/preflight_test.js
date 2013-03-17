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
		.then(function (browser) {
			test.equal(browser.statusCode, 200);
		})
		.fin(test.done);
	},
	'Site is down': function (test) {
		test.expect(1);

		preflight('https://localhost:7357/')
		.fail(function (browser) {
			test.equal(browser.error.code, 'ECONNRESET');
		})
		.fin(test.done);
	},
	'Page not found': function (test) {
		test.expect(1);

		preflight('http://localhost:7357/does_not_exist.html')
		.fail(function (browser) {
			test.equal(browser.statusCode, 404);
		})
		.fin(test.done);
	},
	'Detect missing image': function (test) {
		test.expect(1);

		preflight('http://localhost:7357/missing_image.html')
		.fail(function (browser) {
			test.equal(browser.error, 'TODO');
		})
		.fin(test.done);
	},
	'Detect missing external script': function (test) {
		test.expect(1);

		preflight('http://localhost:7357/missing_script.html')
		.fail(function (browser) {
			test.equal(browser.error.message, 'Unexpected identifier');
		})
		.fin(test.done);
	},
	'Detect script error': function (test) {
		test.expect(1);

		preflight('http://localhost:7357/script_error.html')
		.fail(function (browser) {
			test.equal(browser.error.message, 'foo is not defined');
		})
		.fin(test.done);
	},
	'Follow internal links': function (test) {
		test.expect(1);

		preflight('http://localhost:7357/internal_link.html')
		.then(function (browser) {
			test.equal(browser.location.pathname, '/index.html');
		})
		.fin(test.done);
	},
	'Find broken links': function (test) {
		test.expect(1);

		preflight('http://localhost:7357/broken_link.html')
		.fail(function (error) {
			test.ok(error);
		})
		.fin(test.done);
	},
	'Callback syntax': function (test) {
		test.expect(1);

		preflight('http://localhost:7357/', function () {
			test.ok(true);
		})
		.fin(test.done);
	}
};
