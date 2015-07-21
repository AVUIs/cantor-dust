'use strict';

import midiAccess from 'midi';
import lights     from 'controllers/launchpad/lights';
import grid       from 'controllers/launchpad/grid';

// Use the launchpad rotated 90 degrees anticlockwise

var lp = {};

function recieveMIDIMessage(e) {
  var msg  = e.data,
      note = msg[1];
  if (note.isOnMessage(msg) && note.isGrid(note)) {
    var [x, y] = grid.fromNote(note);
    lights.columnOn(lp, x, y);
  }
}

function registerLaunchpad(input, output) {
  if (input && output) {
    input.onmidimessage = recieveMIDIMessage;
    lp = { input, output };
    lights.gridOff(lp);
  } else {
    throw 'ERROR: Launchpad MIDI device not found';
  }
}

function initLaunchpad() {
  midiAccess.getDevice(registerLaunchpad, /^Launchpad/);
}

export default initLaunchpad;
