'use strict';

import grid from 'controllers/launchpad/grid';

// Decimal Colour Brightness
// 12      Off    Off
// 13      Red    Low
// 15      Red    Full
// 29      Amber  Low
// 63      Amber  Full
// 62      Yellow Full
// 28      Green  Low
// 60      Green  Full


function on(lp, note) {
  lp.output.send([144, note, 63]);
}
function off(lp, note) {
  lp.output.send([144, note, 12]);
}

function flash(lp, note, duration = 500) {
  on(lp, note);
  setTimeout(() => { off(lp, note); }, duration);
}

function columnOff(lp, col) {
  var colOffset = grid.toNote(col, 0),
      i = 8;
  while (i--) { off(lp, colOffset + i); }
}

function columnOn(lp, col, num) {
  var colOffset = grid.toNote(col, 0),
      i = num + 1;
  columnOff(lp, col);
  while (i--) { on(lp, colOffset + i); }
}

function gridOff(lp) {
  var col = 8;
  while (col--) { columnOff(lp, col); }
}


export default { on, off, flash, columnOn, columnOff, gridOff };
