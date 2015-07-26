'use strict';

import message from 'controllers/cmd-lc1/message';

function on(lc, note) {
  lc.output.send([144, note, 3]);
}
function off(lc, note) {
  lc.output.send([144, note, 127]);
}

window.off = off;

function forIterations(lc, note) {
  var i = 8;
  while (i--) {
    off(lc, message.gridNoteFromXY([0, i]));
    off(lc, message.gridNoteFromXY([1, i]));
  }
  on(lc, note);
}

export default { forIterations };
