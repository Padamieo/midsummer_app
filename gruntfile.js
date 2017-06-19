module.exports = function (grunt) {

  var pkg = grunt.file.readJSON('package.json');
  require('load-grunt-tasks')(grunt);

  var productionBuild = !!(grunt.cli.tasks.length && grunt.cli.tasks[0] === 'build');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    project: {
      src: 'src/js',
      js: '<%= project.src %>/{,*/}*.js',
      dest: 'www/js',
      bundle: 'www/js/app.js',
      port: pkg.port,
      banner:
        '/*\n' +
        ' * <%= pkg.name %>\n' +
        ' * <%= pkg.description %>\n' +
        ' * @author <%= pkg.author %>\n' +
        ' * @version <%= pkg.version %>\n' +
        ' * @copyright <%= pkg.author %>\n' +
        ' */\n'
    },

    connect:{
      dev:{
        options:{
          port: '<%= project.port %>',
          base: './www'
        }
      }
    },

    watch:{
      options:{
        livereload: productionBuild ? false : pkg.liveReloadPort
      },
      html:{
        files: 'src/**.html',
        tasks: ['copy:html']
      },
      less:{
        files: 'src/less/*.less',
        tasks: ['less']
      }
    },

    browserify:{
      app:{
        src: [
          '<%= project.src %>/app.js',
          //'node_modules/handlebars/dist/handlebars.js',
          //'temp/templates.js',
          //(productionBuild ? '' : './helpers/livereload.js' )
        ], // '<%= project.src %>/app.js',
        dest: '<%= project.bundle %>',
        options:{
          transform: ['browserify-shim'],
          watch: true,
          browserifyOptions:{
            debug: !productionBuild
          }
        }
      }
    },

    open:{
      server:{
        path: 'http://localhost:<%= project.port %>'
      }
    },

    cacheBust:{
      options:{
        assets: ['js/**', 'style/**'],
        baseDir: './www/',
        deleteOriginals: true,
        length: 5
      },
      files: {
        src: ['./www/js/app.*', './www/index.html']
      }
    },

    clean: ['./www/'],

    copy:{
      html:{
        files:[{
          cwd: 'src/',
          src: ['**', '!**/js/*.js', '!**/*.{jpg,png,hbs,less,json,wav,js}'],
          dest: 'www/',
          nonull: false,
          expand: true,
          flatten: false,
          filter: 'isFile'
        },]
      }
    },

    uglify:{
      options:{
        banner: '<%= project.banner %>'
      },
      dist:{
        files:{
          '<%= project.bundle %>' : '<%= project.bundle %>'
        }
      }
    },

    less: {
			live: {
				options: {
					strictMath: true,
					sourceMap: true,
					outputSourceFiles: true,
					sourceMapURL: 'style.css.map',
					sourceMapFilename: 'www/css/style.css.map'
				},
				src: 'src/less/style.less',
				dest: 'www/css/style.css'
			}
		},

    handlebars: {
			all: {
				files: {
					"temp/templates.js": ["src/templates/*.hbs"]
				}
			}
		}

  });

  grunt.registerTask('default', [
    'clean',
    'browserify',
    'less',
    'copy:html',
    'serve',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean',
    'browserify',
    'less',
    'copy:html',
    'cacheBust',
    'uglify'
  ]);

  grunt.registerTask('test',[
    'handlebars'
  ]);

  grunt.registerTask('serve',[
    'connect',
    'open',
    'watch'
  ]);

  grunt.registerTask('i', function(){
    console.log(pkg.liveReloadPort);
  });

};
