#!/usr/bin/env node

var pkg = require('./package.json');
var preflight = require('./');
var program = require('commander');

program
	.version(pkg.version)
	.usage('[options] <url ...>')
	.parse(process.argv);

preflight(program.args)
.then(function (report) {
	console.log('Success', JSON.stringify(report, null, 3));
}, function (report) {
	console.log('Error', JSON.stringify(report, null, 3));
})
.fin(function () {
	console.log('Done');
	process.nextTick(function () {
		process.exit();
	});
});
