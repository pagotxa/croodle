/*jshint node:true*/
/* global require, module */
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function() {
  const pickFiles = require('broccoli-static-compiler');
  const unwatchedTree    = require('broccoli-unwatched-tree');
  const trees = [];

  const app = new EmberApp({
    babel: {
      optional: ['es6.spec.symbols'],
      includePolyfill: true
    },
    'buildInfoOptions': {
      'metaTemplate': 'version={SEMVER}'
    }
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  app.import({
    development: 'bower_components/bootstrap/dist/js/bootstrap.js',
    production: 'bower_components/bootstrap/dist/js/bootstrap.min.js'
  });
  app.import({
    development: 'bower_components/bootstrap/dist/css/bootstrap.css',
    production: 'bower_components/bootstrap/dist/css/bootstrap.min.css'
  });
  if (app.env === 'development' || app.env === 'test') {
    app.import('bower_components/bootstrap/dist/css/bootstrap.css.map', {
      destDir: 'assets'
    });
  }
  // include bootstrap fonts in dist
  trees.push(
    pickFiles('bower_components/bootstrap/dist/fonts', {
      srcDir: '/',
      destDir: '/fonts'
    })
  );

  app.import('bower_components/bootstrap-datepicker/js/bootstrap-datepicker.js');
  app.import('bower_components/bootstrap-datepicker/js/locales/bootstrap-datepicker.de.js');

  app.import({
    development: 'bower_components/floatThead/dist/jquery.floatThead.js',
    production: 'bower_components/floatThead/dist/jquery.floatThead.min.js'
  });

  app.import('bower_components/sjcl/sjcl.js');

  app.import('bower_components/modernizr/modernizr.js');

  // ChartJS StackedBar addon
  app.import('bower_components/Chart.StackedBar.js/src/Chart.StackedBar.js');

  // webshim
  app.import({
    development: 'bower_components/webshim/js-webshim/dev/polyfiller.js',
    production: 'bower_components/webshim/js-webshim/minified/polyfiller.js'
  });
  trees.push(
    pickFiles('bower_components/webshim/js-webshim/minified/shims', {
      srcDir: '/',
      destDir: '/assets/shims'
    })
  );

  app.import('bower_components/jstimezonedetect/jstz.js');

  // include api files into dist
  trees.push(
    pickFiles(unwatchedTree('api'), {
      srcDir: '/',
      destDir: '/api',
      files: ['index.php', 'cron.php', 'classes/*', 'vendor/*']
    })
  );

  if (app.env === 'development' || app.env === 'test') {
    trees.push(
      pickFiles('tests/dummyData', {
        srcDir: '/',
        destDir: '/data'
      })
    );
  }

  trees.push(app.toTree());
  const mergeTrees = require('broccoli-merge-trees');
  return mergeTrees(trees);
};
