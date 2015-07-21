'use strict';

exports.config = {
  files: {
    javascripts: { joinTo: 'main.js', },
    stylesheets: { joinTo: 'main.css', },
  },

  npm: { enabled: true },

  plugins: {
    babel: {
      ignore: [/^vendor/],
    }
  },
};
