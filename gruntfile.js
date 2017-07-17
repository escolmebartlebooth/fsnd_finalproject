module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      main: {
        expand: true,
        cwd: 'src',
        src: '**/*.html',
        dest: 'dest',
      },
    },
    cssmin: {
        target: {
          files: [{
            expand: true,
            cwd: 'src/static',
            src: ['**/*.css', '!*.min.css'],
            dest: 'build/static',
            ext: '.min.css'
          }]
        }
      },
    uglify: {
      build: {
        files: [{
          expand: true,
          cwd: 'src/js',
          src: '**/*.js',
          dest: 'build/js',
          ext: '.min.js'
        }]
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
  grunt.registerTask('default', ['copy','uglify','cssmin']);

};