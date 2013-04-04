'use strict';

module.exports = function (grunt) {

	grunt.initConfig({
		jshint: {
			files: [
				'Gruntfile.js',
				'index.js',
				'bin/*',
				'robots/**/*.js',
				'<%= nodeunit.tests %>'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		connect: {
			test: {
				options: {
					base: 'test/fixtures',
					port: 7357
				}
			}
		},

		nodeunit: {
			tests: ['test/*_test.js']
		},

		watch: {
			files: ['<%= jshint.files %>'],
			tasks: ['jshint', 'nodeunit']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('test', ['jshint', 'connect', 'nodeunit']);
	grunt.registerTask('default', ['test']);
	grunt.registerTask('dev', ['test', 'watch']);
};
