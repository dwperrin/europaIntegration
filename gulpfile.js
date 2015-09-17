var args = require('yargs').argv;
var browserSync = require('browser-sync');
var gulpConfig = require('./gulp.config')();
var del = require('del');
var glob = require('glob');
var gulp = require('gulp');
var path = require('path');
var _ = require('lodash');
var plugins = require('gulp-load-plugins')({lazy: true});
var yaml = require('js-yaml');
var fs = require('fs');
var git = require('gulp-git');
var moment = require('moment');

var colors = plugins.util.colors;
var envenv = plugins.util.env;
var port = process.env.PORT || gulpConfig.defaultPort;

/**
 * yargs variables can be passed in to alter the behavior, when present.
 * Example: gulp serve-dev
 *
 * --verbose  : Various tasks will produce more output to the console.
 * --nosync   : Don't launch the browser with browser-sync when serving code.
 * --debug    : Launch debugger with node-inspector.
 * --debug-brk: Launch debugger and break on 1st line with node-inspector.
 * --startServers: Will start servers for midway tests on the test task.
 */

/**
 * List the available gulp tasks
 */
gulp.task('help', plugins.taskListing);
gulp.task('default', ['help']);

/************************************************************************
 ***************************** VETTING  *********************************
 ************************************************************************/

/**
 * vet the code and create coverage report
 * @return {Stream}
 */
gulp.task('vet', function() {
    log('Analyzing source with JSHint and JSCS');

    return gulp
        .src(gulpConfig.alljs)
        .pipe(plugins.if(args.verbose, plugins.print()))
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish', {verbose: true}))
        .pipe(plugins.jshint.reporter('fail'))
        .pipe(plugins.jscs());
});
// END VETTING

/************************************************************************
 ***************************  DEPLOYMENT  *******************************
 ************************************************************************/
//
// gulp.task('deploy', [], function() {
//     log('Begining deployment');
//     var repository = '';
//     if (args.live) {
//         updateNodeEnvInIisNodeYaml('productionLive');
//         repository = 'html5live';
//     }
//     else if (args.stage) {
//         updateNodeEnvInIisNodeYaml('productionStaging');
//         repository = 'html5staging';
//     }
//     else if (args.test) {
//         updateNodeEnvInIisNodeYaml('productionTest');
//         repository = 'html5test';
//     }
//     if (args.sofcotlive) {
//         updateNodeEnvInIisNodeYaml('productionLiveSofcot');
//         repository = 'sofcothtml5live';
//     }
//     else if (args.sofcotstage) {
//         updateNodeEnvInIisNodeYaml('productionStagingSofcot');
//         repository = 'sofcothtml5staging';
//     }
//     else if (args.sofcottest) {
//         updateNodeEnvInIisNodeYaml('productionTestSofcot');
//         repository = 'sofcothtml5test';
//     }
//
//     git.exec({args: gulpConfig.gitBuildParameters + ' status'}, function (err, stdout) {
//         console.log(stdout);
//         git.exec({args: gulpConfig.gitBuildParameters + ' add -A'}, function (err, stdout) {
//             console.log(stdout);
//             git.exec({args: gulpConfig.gitBuildParameters + ' commit -am "deploy commit: ' + moment().toISOString() + '"'}, function (err, stdout) {
//                 console.log(stdout);
//                 git.exec({args: gulpConfig.gitBuildParameters + ' push ' + repository + ' master'}, function (err, stdout) {
//                     if (err) {
//                         throw err;
//                     }
//                     console.log(stdout);
//                 });
//             });
//         });
//     });
// });

// END DEPLOYEMNT
/************************************************************************
 ***************************  TOTAL BULD  *******************************
 ************************************************************************/

gulp.task('build', ['vet', 'build-app', 'build-server'], function() {
    log('Building all');

    var msg = {
        title: 'gulp build',
        subtitle: 'Deployed to the build folder',
    };
    del(gulpConfig.temp);
    log(msg);
    notify(msg);
});
// END TOTAL BUILD

/************************************************************************
 *************************  SERVER APP BUILD  ***************************
 ************************************************************************/

gulp.task('build-server', ['vet', 'clean-server-code'], function() {
    log('Building server app');
    return gulp
        .src([gulpConfig.allserverjs,
              gulpConfig.server + 'favicon.ico',
              gulpConfig.server + 'iisnode.yml',
              gulpConfig.server + 'web.config'])
        .pipe(gulp.dest(gulpConfig.build));
});

// END SERVER APP BUILD

/************************************************************************
 *************************  CLIENT APP BUILD  ***************************
 ************************************************************************/

/**
 * Build everything
 * This is separate so we can run tests on
 * optimize before handling image or fonts
 */
gulp.task('build-app', ['vet', 'optimize', 'images', 'fonts'], function() {
    log('Building client app');

    var msg = {
        title: 'gulp build-app',
        subtitle: 'Deployed to the build/app folder',
    };
    del(gulpConfig.temp);
    log(msg);
    notify(msg);
});

/**
 * Optimize all files, move to a build folder,
 * and inject them into the new index.html
 * @return {Stream}
 */
gulp.task('optimize', ['vet', 'inject'], function() { //, 'test'
    log('Optimizing the js, css, and html');

    var assets = plugins.useref.assets({searchPath: './'});
    // Filters are named for the gulp-useref path
    var cssFilter = plugins.filter('**/*.css');
    var jsAppFilter = plugins.filter('**/' + gulpConfig.optimized.app);
    var jslibFilter = plugins.filter('**/' + gulpConfig.optimized.lib);

    var templateCache = gulpConfig.temp + gulpConfig.templateCache.file;

    return gulp
        .src(gulpConfig.index)
        .pipe(plugins.plumber())
        .pipe(inject(templateCache, 'templates'))
        .pipe(assets) // Gather all assets from the html with useref
        // Get the css
        .pipe(cssFilter)
        .pipe(plugins.csso())
        .pipe(cssFilter.restore())
        // Get the custom javascript
        .pipe(jsAppFilter)
        .pipe(plugins.ngAnnotate({add: true}))
        .pipe(plugins.uglify())
        .pipe(getHeader())
        .pipe(jsAppFilter.restore())
        // Get the vendor javascript
        .pipe(jslibFilter)
        .pipe(plugins.uglify()) // another option is to override wiredep to use min files
        .pipe(jslibFilter.restore())
        // Take inventory of the file names for future rev numbers
        .pipe(plugins.rev())
        // Apply the concat and file replacement with useref
        .pipe(assets.restore())
        .pipe(plugins.useref())
        // Replace the file names in the html with rev numbers
        .pipe(plugins.revReplace())
        .pipe(gulp.dest(gulpConfig.appBuild));
});

/**
 * Copy fonts
 * @return {Stream}
 */
gulp.task('fonts', ['vet', 'clean-fonts'], function() {
    log('Copying fonts');

    return gulp
        .src(gulpConfig.fonts)
        .pipe(gulp.dest(gulpConfig.appBuild + 'content/fonts'));
});

/**
 * Compress images
 * @return {Stream}
 */
gulp.task('images', ['vet', 'clean-images'], function() {
    log('Compressing and copying images');

    return gulp
        .src(gulpConfig.images)
        .pipe(plugins.imagemin({optimizationLevel: 4}))
        .pipe(gulp.dest(gulpConfig.appBuild + 'content/img'));
});

gulp.task('inject', ['vet', 'wiredep', 'styles', 'templatecache'], function() {
    log('Wire up css into the html, after files are ready');

    return gulp
        .src(gulpConfig.index)
        .pipe(inject(gulpConfig.css))
        .pipe(gulp.dest(gulpConfig.client));
});

/**
 * Wire-up the bower dependencies
 * @return {Stream}
 */
gulp.task('wiredep', ['vet'], function() {
    log('Wiring the bower dependencies into the html');

    var wiredep = require('wiredep').stream;
    var options = gulpConfig.getWiredepDefaultOptions();

    // Only include stubs if flag is enabled
    var js = args.stubs ? [].concat(gulpConfig.js, gulpConfig.stubsjs) : gulpConfig.js;

    return gulp
        .src(gulpConfig.index)
        .pipe(wiredep(options))
        .pipe(inject(js, '', gulpConfig.jsOrder))
        .pipe(gulp.dest(gulpConfig.client));
});

/**
 * Compile less to css
 * @return {Stream}
 */
gulp.task('styles', ['vet', 'clean-styles'], function() {
    log('Compiling Less --> CSS');

    return gulp
        .src(gulpConfig.less)
        .pipe(plugins.plumber()) // exit gracefully if something fails after this
        .pipe(plugins.less())
//        .on('error', errorLogger) // more verbose and dupe output. requires emit.
        .pipe(plugins.autoprefixer({browsers: ['last 2 version', '> 5%']}))
        .pipe(gulp.dest(gulpConfig.temp));
});

/**
 * Create pluginstemplateCache from the html templates
 * @return {Stream}
 */
gulp.task('templatecache', ['vet', 'clean-app-code'], function() {
    log('Creating an AngularJS pluginstemplateCache');

    return gulp
        .src(gulpConfig.htmltemplates)
        .pipe(plugins.if(args.verbose, plugins.bytediff.start()))
        .pipe(plugins.minifyHtml({empty: true}))
        .pipe(plugins.if(args.verbose, plugins.bytediff.stop(bytediffFormatter)))
        .pipe(plugins.angularTemplatecache(
            gulpConfig.templateCache.file,
            gulpConfig.templateCache.options
        ))
        .pipe(gulp.dest(gulpConfig.temp));
});
// END CLIENT APP BUILD

/************************************************************************
 ****************************  CLEANING  ********************************
 ************************************************************************/

/**
 * Remove all files from the build, temp, and reports folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean', function(done) {
    var delgulpConfig = [].concat(gulpConfig.appBuild, gulpConfig.temp, gulpConfig.report);
    log('Cleaning: ' + plugins.util.colors.blue(delgulpConfig));
    del(delgulpConfig, done);
});

/**
 * Remove all fonts from the build folder
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-fonts', function(done) {
    clean(gulpConfig.appBuild + 'content/fonts/**/*.*', done);
});

/**
 * Remove all images from the build folder
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-images', function(done) {
    clean(gulpConfig.appBuild + 'content/img/**/*.*', done);
});

/**
 * Remove all styles from the build and temp folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-styles', function(done) {
    var files = [].concat(
        gulpConfig.temp + '**/*.css',
        gulpConfig.appBuild + 'content/css/**/*.css'
    );
    clean(files, done);
});

/**
 * Remove all js and html from the build and temp folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-app-code', function(done) {
    var files = [].concat(
        gulpConfig.temp + '**/*.js',
        gulpConfig.appBuild + 'js/**/*.js',
        gulpConfig.appbuild + '**/*.html'
    );
    clean(files, done);
});

gulp.task('clean-server-code', function(done) {
    var files = [].concat(
        gulpConfig.build + '**/*',
        '!' + gulpConfig.appBuild + '**',
        '!' + gulpConfig.build + '.gitignore',
        '!' + gulpConfig.build + '.git/',
        '!' + gulpConfig.build + 'package.json'
    );
    clean(files, done);
});

// END CLEANING

/************************************************************************
 ***************************  APP TESTING  ******************************
 ************************************************************************/

/**
 * Run specs once and exit
 * To start servers and run midway specs as well:
 *    gulp test --startServers
 * @return {Stream}
 */
gulp.task('apptests', ['vet', 'templatecache'], function(done) {
    startTests(true /*singleRun*/ , done);
});

/**
 * Run specs and wait.
 * Watch for file changes and re-run tests on each change
 * To start servers and run midway specs as well:
 *    gulp autotest --startServers
 */
gulp.task('appautotest', function(done) {
    startTests(false /*singleRun*/ , done);
});

/**
 * Run the spec runner
 * @return {Stream}
 */
gulp.task('serve-specs', ['build-specs'], function(done) {
    log('run the spec runner');
    serve(true /* isDev */, true /* specRunner */);
    done();
});

/**
 * Inject all the spec files into the specs.html
 * @return {Stream}
 */
gulp.task('build-specs', ['templatecache'], function(done) {
    log('building the spec runner');

    var wiredep = require('wiredep').stream;
    var templateCache = gulpConfig.temp + gulpConfig.templateCache.file;
    var options = gulpConfig.getWiredepDefaultOptions();
    var specs = gulpConfig.specs;

    if (args.startServers) {
        specs = [].concat(specs, gulpConfig.serverIntegrationSpecs);
    }
    options.devDependencies = true;

    return gulp
        .src(gulpConfig.specRunner)
        .pipe(wiredep(options))
        .pipe(inject(gulpConfig.js, '', gulpConfig.jsOrder))
        .pipe(inject(gulpConfig.testlibraries, 'testlibraries'))
        .pipe(inject(gulpConfig.specHelpers, 'spechelpers'))
        .pipe(inject(specs, 'specs', ['**/*']))
        .pipe(inject(templateCache, 'templates'))
        .pipe(gulp.dest(gulpConfig.client));
});
//END APP TESTING

/************************************************************************
 *************************  SERVER TESTING  *****************************
 ************************************************************************/

gulp.task('serverunittests', ['vet'], function (done) {
    gulp.src([gulpConfig.server + '**/*.js', '!./src/server/tests/unit/**/*'])
        .pipe(plugins.istanbul())
        .pipe(plugins.istanbul.hookRequire())
        .on('finish', function() {
            gulp.src(gulpConfig.serverUnitTests, {read: false})
                .pipe(plugins.mocha())
                .pipe(plugins.istanbul.writeReports())
                .pipe(plugins.exit());
            //.pipe(plugins.istanbul.enforceThresholds({thresholds: {global: 85}}))
        });
});

gulp.task('serverintergrationtests', ['vet'], function (cb) {
    return gulp.src([gulpConfig.server + '**/*.js',
                                     '!./src/server/tests/intergration/**/*',
                                     '!./src/server/tests/unit/**/*'])
        .on('finish', function() {
            gulp.src(gulpConfig.serverIntergrationTests, {read: false})
                .pipe(plugins.mocha())
                .pipe(plugins.exit());
        });
});
// END SERVER TESTING

/**
 * serve the dev environment
 * --debug-brk or --debug
 * --nosync
 */
gulp.task('serve-dev', ['inject'], function() {
    serve(true /*isDev*/);
});

/**
 * serve the build environment
 * --debug-brk or --debug
 * --nosync
 */
gulp.task('serve-build', ['build'], function() {
    serve(false /*isDev*/);
});

/**
 * Bump the version
 * --type=pre will bump the prerelease version *.*.*-x
 * --type=patch or no flag will bump the patch version *.*.x
 * --type=minor will bump the minor version *.x.*
 * --type=major will bump the major version x.*.*
 * --version=1.2.3 will bump to a specific version and ignore other flags
 */
gulp.task('bump', function() {
    var msg = 'Bumping versions';
    var type = args.type;
    var version = args.ver;
    var options = {};
    if (version) {
        options.version = version;
        msg += ' to ' + version;
    } else {
        options.type = type;
        msg += ' for a ' + type;
    }
    log(msg);

    return gulp
        .src(gulpConfig.packages)
        .pipe(plugins.print())
        .pipe(plugins.bump(options))
        .pipe(gulp.dest(gulpConfig.root));
});

////////////////

/************************************************************************
 ***********************  INTERNAL FUNCTIONS  ***************************
 ************************************************************************/

/**
 * When files change, log it
 * @param  {Object} event - event that fired
 */
function changeEvent(event) {
    var srcPattern = new RegExp('/.*(?=/' + gulpConfig.source + ')/');
    log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

/**
 * Delete all files in a given path
 * @param  {Array}   path - array of paths to delete
 * @param  {Function} done - callback when complete
 */
function clean(path, done) {
    log('Cleaning: ' + plugins.util.colors.blue(path));
    del(path, done);
}

/**
 * Inject files in a sorted sequence at a specified inject label
 * @param   {Array} src   glob pattern for source files
 * @param   {String} label   The label name
 * @param   {Array} order   glob pattern for sort order of the files
 * @returns {Stream}   The stream
 */
function inject(src, label, order) {
    var options = {read: false};
    if (label) {
        options.name = 'inject:' + label;
    }

    return plugins.inject(orderSrc(src, order), options);
}

/**
 * Order a stream
 * @param   {Stream} src   The gulp.src stream
 * @param   {Array} order Glob array pattern
 * @returns {Stream} The ordered stream
 */
function orderSrc (src, order) {
    //order = order || ['**/*'];
    return gulp
        .src(src)
        .pipe(plugins.if(order, plugins.order(order)));
}

/**
 * serve the code
 * --debug-brk or --debug
 * --nosync
 * @param  {Boolean} isDev - dev or build mode
 * @param  {Boolean} specRunner - server spec runner html
 */
function serve(isDev, specRunner) {
    var debug = args.debug || args.debugBrk;
    var debugMode = args.debug ? '--debug' : args.debugBrk ? '--debug-brk' : '';
    var nodeOptions = getNodeOptions(isDev);

    if (debug) {
        runNodeInspector();
        nodeOptions.nodeArgs = [debugMode + '=5858'];
    }

    if (args.verbose) {
        console.log(nodeOptions);
    }

    return plugins.nodemon(nodeOptions)
        .on('restart', ['vet'], function(ev) {
            log('*** nodemon restarted');
            log('files changed:\n' + ev);
            setTimeout(function() {
                browserSync.notify('reloading now ...');
                browserSync.reload({stream: false});
            }, gulpConfig.browserReloadDelay);
        })
        .on('start', function () {
            log('*** nodemon started');
            startBrowserSync(isDev, specRunner);
        })
        .on('crash', function () {
            log('*** nodemon crashed: script crashed for some reason');
        })
        .on('exit', function () {
            log('*** nodemon exited cleanly');
        });
}

function getNodeOptions(isDev) {
    return {
        script: gulpConfig.nodeServer,
        delayTime: 1,
        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'build'
        },
        watch: [gulpConfig.server]
    };
}

function runNodeInspector() {
    log('Running node-inspector.');
    log('Browse to http://localhost:8080/debug?port=5858');
    var exec = require('child_process').exec;
    exec('node-inspector');
}

/**
 * Start BrowserSync
 * --nosync will avoid browserSync
 */
function startBrowserSync(isDev, specRunner) {
    if (args.nosync || browserSync.active) {
        return;
    }

    log('Starting BrowserSync on port ' + port);

    // If build: watches the files, builds, and restarts browser-sync.
    // If dev: watches less, compiles it to css, browser-sync handles reload
    if (isDev) {
        gulp.watch([gulpConfig.less], ['styles'])
            .on('change', changeEvent);
    } else {
        gulp.watch([gulpConfig.less, gulpConfig.js, gulpConfig.html], ['optimize', browserSync.reload])
            .on('change', changeEvent);
    }

    var options = {
        proxy: 'localhost:' + port,
        port: 3002,
        files: isDev ? [
            gulpConfig.client + '**/*.*',
            '!' + gulpConfig.less,
            gulpConfig.temp + '**/*.css'
        ] : [],
        ghostMode: { // these are the defaults t,f,t,t
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'gulp-patterns',
        notify: true,
        reloadDelay: 0 //1000
    } ;
    if (specRunner) {
        options.startPath = gulpConfig.specRunnerFile;
    }

    browserSync(options);
}

/**
 * Start the tests using karma.
 * @param  {boolean} singleRun - True means run once and end (CI), or keep running (dev)
 * @param  {Function} done - Callback to fire when karma is done
 * @return {undefined}
 */
function startTests(singleRun, done) {
    var child;
    var excludeFiles = [];
    var fork = require('child_process').fork;
    var karma = require('karma').server;
    var serverSpecs = gulpConfig.serverIntegrationSpecs;

    if (args.startServers) {
        log('Starting servers');
        var savedEnv = process.env;
        savedEnv.NODE_ENV = 'dev';
        savedEnv.PORT = 8888;
        child = fork(gulpConfig.nodeServer);
    } else {
        if (serverSpecs && serverSpecs.length) {
            excludeFiles = serverSpecs;
        }
    }

    karma.start({
        gulpConfigFile: __dirname + '/karma.conf.js',
        exclude: excludeFiles,
        singleRun: !!singleRun
    }, karmaCompleted);

    ////////////////

    function karmaCompleted(karmaResult) {
        log('Karma completed');
        if (child) {
            log('shutting down the child process');
            child.kill();
        }
        if (karmaResult === 1) {
            done('karma: tests failed with code ' + karmaResult);
        } else {
            done();
        }
    }
}

/**
 * Formatter for bytediff to display the size changes after processing
 * @param  {Object} data - byte data
 * @return {String}      Difference in bytes, formatted
 */
function bytediffFormatter(data) {
    var difference = (data.savings > 0) ? ' smaller.' : ' larger.';
    return data.fileName + ' went from ' +
        (data.startSize / 1000).toFixed(2) + ' kB to ' +
        (data.endSize / 1000).toFixed(2) + ' kB and is ' +
        formatPercent(1 - data.percent, 2) + '%' + difference;
}

/**
 * Log an error message and emit the end of a task
 */
function errorLogger(error) {
    log('*** Start of Error ***');
    log(error);
    log('*** End of Error ***');
    this.emit('end');
}

/**
 * Format a number as a percentage
 * @param  {Number} num       Number to format as a percent
 * @param  {Number} precision Precision of the decimal
 * @return {String}           Formatted perentage
 */
function formatPercent(num, precision) {
    return (num * 100).toFixed(precision);
}

/**
 * Format and return the header for files
 * @return {String}           Formatted file header
 */
function getHeader() {
    var pkg = require('./package.json');
    var template = ['/**',
        ' * <%= pkg.name %> - <%= pkg.description %>',
        ' * @authors <%= pkg.authors %>',
        ' * @version v<%= pkg.version %>',
        ' * @link <%= pkg.homepage %>',
        ' * @license <%= pkg.license %>',
        ' */',
        ''
    ].join('\n');
    return plugins.header(template, {
        pkg: pkg
    });
}

/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                plugins.util.log(plugins.util.colors.blue(msg[item]));
            }
        }
    } else {
        plugins.util.log(plugins.util.colors.blue(msg));
    }
}

/**
 * Show OS level notification using node-notifier
 */
function notify(options) {
    var notifier = require('node-notifier');
    var notifyOptions = {
        sound: 'Bottle',
        contentImage: path.join(__dirname, 'gulp.png'),
        icon: path.join(__dirname, 'gulp.png')
    };
    _.assign(notifyOptions, options);
    notifier.notify(notifyOptions);
}

function updateNodeEnvInIisNodeYaml(env) {
    log('updating the node_env setting in iisnode.yml');

    var filename = gulpConfig.build + 'iisnode.yml';
    var watchedFiles = '*.js;iisnode.yml';

    var contents = fs.readFileSync(filename);
    var data = yaml.load(contents);
    //jscs:disable
    /* jshint -W106 */
    data.node_env = env;
    //jscs:enable
    data.watchedFiles = watchedFiles;
    var modifiedContents = yaml.dump(data);
    writeStringToFile(filename, modifiedContents);
}

function writeStringToFile(file, str) {
    log('writing out file: ' + file);
    fs.writeFile(file, str, function(err) {
    if (err) {
        console.log(err);
        throw(err);
    }
    log('finished writing out file: ' + file);
});
}

module.exports = gulp;
