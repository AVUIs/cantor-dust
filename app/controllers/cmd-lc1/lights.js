'use strict';

import message from 'controllers/cmd-lc1/message';

function on(lc, note) {
  lc.output.send([144, note, 3]);
}
function off(lc, note) {
  lc.output.send([144, note, 127]);
}

function numBlue(lc, note) {
  lc.output.send([144, note, 1]);
}
function numOrange(lc, note) {
  lc.output.send([144, note, 0]);
}

function forIterations(lc, itr) {
  var i = 16;
  while (i--) {
    off(lc, i + 32);
  }
  while (itr--) {
    on(lc, itr + 32);
  }
}

function forFocus(lc, n) {
  var i = 8;
  while (i--) {
    numOrange(lc, i + 16);
  }
  numBlue(lc, message.toNumber(n));
}

export default { forIterations, forFocus };
