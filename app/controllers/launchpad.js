'use strict';

import midiAccess from 'midi';
import player     from 'player';
import lights     from 'controllers/launchpad/lights';
import grid       from 'controllers/launchpad/grid';
import note       from 'controllers/launchpad/note';

// Use the launchpad rotated 90 degrees anticlockwise

var lp = {};

function initLaunchpad() {
  midiAccess.getDevice(registerLaunchpad, /^Launchpad/);
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


function recieveMIDIMessage(e) {
  var msg  = e.data,
      note = msg[1],
      x, y;
  if (note.isOnMessage(msg) && note.isGrid(note)) {
    [x, y] = grid.fromNote(note);
    lights.columnOn(lp, x, y);
  }
}

export default initLaunchpad;
