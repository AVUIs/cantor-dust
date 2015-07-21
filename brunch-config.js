'use strict';

exports.config = {
  files: {
    javascripts: {
      joinTo: 'main.js',
    },
    stylesheets: {
      joinTo: 'main.css',
    },
    templates: {
      joinTo: 'templates.js',
    }
  },

  npm: {
    enabled: true
  },

  plugins: {
    babel: {
      ignore: [/^vendor/],
    }
  },
};
