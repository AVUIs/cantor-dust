'use strict';

import midiAccess from 'midi';
import message    from 'controllers/cmd-lc1/message';
import controls   from 'controllers/cmd-lc1/controls';

var lc;

function recieveMIDIMessage(e) {
  var x, y, a, msg = e.data;
  if (message.isEncoder(msg)) {
    controls.adjustPattern(message.fromEncoder(msg));

  } else if (message.isNumberOn(msg)) {
    controls.setFocus(message.fromNumberOn(msg));

  } else if (message.isGridOn(msg)) {
    [x, y] = message.fromGrid(msg);
    a = (x * 8) + (y + 1);
    controls.setIterations(lc, Math.min(a, 16), msg[1]);
  }
}

function registerCMDLC1(input, output) {
  if (input && output) {
    input.onmidimessage = recieveMIDIMessage;
    lc = { input, output };
  } else {
    throw 'ERROR: Launchpad MIDI device not found';
  }
}

function initCMDLC1() {
  midiAccess.getDevice(registerCMDLC1, /^CMD LC-1$/);
  controls.init();
}

export default initCMDLC1;
