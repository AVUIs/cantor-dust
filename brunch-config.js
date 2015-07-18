'use strict';

exports.config = {
  // See http://brunch.io/#documentation for docs.
  files: {
    javascripts: {
      joinTo: {
        'main.js': /^src/,
      }

      // To use a separate vendor.js bundle, specify two files path
      // https://github.com/brunch/brunch/blob/stable/docs/config.md#files
      // joinTo: {
      //  'js/app.js': /^(web\/static\/js)/,
      //  'js/vendor.js': /^(web\/static\/vendor)/
      // }
      //
      // To change the order of concatenation of files, explictly mention here
      // https://github.com/brunch/brunch/tree/stable/docs#concatenation
      // order: {
      //   before: [
      //     'web/static/vendor/js/jquery-2.1.1.js',
      //     'web/static/vendor/js/bootstrap.min.js'
      //   ]
      // }

    },
    stylesheets: {
      joinTo: 'main.css'
    },
    templates: {
      joinTo: 'templates.js'
    }
  },

  paths: {
    watched: ["src", "test"],

    // Where to compile files to
    public: "dist"
  },

  // Configure your plugins
  plugins: {
    babel: {
      // Do not use ES6 compiler in vendor code
      ignore: [
        /^src\/vendor/,
        'src/worker.js',
      ]
    }
  },

  modules: {
    nameCleaner: function(path) {
      return path.replace(/^src\//, '');
    },
  },
};
