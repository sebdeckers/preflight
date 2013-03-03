'use strict';

module.exports = function (grunt) {

	grunt.initConfig({
		jshint: {
			files: [
				'Gruntfile.js',
				'index.js',
				'<%= nodeunit.tests %>'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		nodeunit: {
			tests: ['test/*_test.js']
		},

		watch: {
			files: ['<%= jshint.files %>'],
			tasks: ['test']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('test', ['jshint', 'nodeunit']);
	grunt.registerTask('default', ['test']);
};
