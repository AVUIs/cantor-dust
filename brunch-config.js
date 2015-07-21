'use strict';

exports.config = {
  files: {
    javascripts: {
      joinTo: {
        'main.js':   /^app/,
        'vendor.js': /^vendor/,
      }
    },
  },

  npm: { enabled: true },
};
