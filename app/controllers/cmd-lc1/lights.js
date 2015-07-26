'use strict';

function on(lc, note) {
  lc.output.send([144, note, 3]);
}
function off(lc, note) {
  lc.output.send([144, note, 127]);
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

export default { forIterations };
