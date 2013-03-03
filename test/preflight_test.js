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
	'returns success': function (test) {
		test.expect(1);

		preflight('http://localhost/')
		.then(function (result) {
			test.ok(result.success, 'Always passes');
		})
		.fail(function () {
		})
		.fin(test.done);
	}
};
