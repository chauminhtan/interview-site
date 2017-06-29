var gulp   = require( 'gulp' ),
    server = require( 'gulp-develop-server' ),
	jshint = require('gulp-jshint'),
    paths = require('./gulp.config.json'),
    plug = require('gulp-load-plugins')(),
    argv = require('yargs').argv;

var isProduction = !!(argv.production),
    env = plug.util.env,
    log = plug.util.log;

/**
 * List the available gulp tasks
 */
gulp.task('help', plug.taskListing);

// Lint code	
gulp.task('lint', function() {
  return gulp.src(paths.server + 'server.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Compiles Sass
// gulp.task('sass', function (mode) {
//     log('Compiling Sass');
//     var minifyCss = plug.if(isProduction, plug.minifyCss());
//     var dest = mode === 'build' ?  paths.build + 'assets/css/' : paths.client + 'assets/css';
//     return gulp.src(paths.client + 'assets/scss/app.scss')
//         .pipe(plug.sass({
//             includePaths: paths.sass,
//             outputStyle: (isProduction ? 'compressed' : 'nested'),
//             errLogToConsole: true
//         }))
//         .pipe(plug.autoprefixer({
//             browsers: ['last 2 versions', 'ie 10']
//         }))
//         .pipe(minifyCss)
//         .pipe(gulp.dest(dest));
// });
	
// run server 
gulp.task( 'server:start', function() {
    // Rebuild CSS if any scss changes
    // gulp.watch(paths.client + 'assets/scss/**/*.scss', ['sass']);
    server.listen( { path: paths.server + 'server.js' } );
});
 
// restart server if server.js changed 
gulp.task( 'server:restart', function() {
    gulp.watch( [ paths.server + '**/*.js' ], server.restart );
});

gulp.task('default', ['lint','server:start','server:restart']);