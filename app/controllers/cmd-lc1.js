'use strict';

import midiAccess from 'midi';
import message    from 'controllers/cmd-lc1/message';
import controls   from 'controllers/cmd-lc1/controls';
import lights     from 'controllers/cmd-lc1/lights';
import state      from 'state';

var lc;

function handleIterationMessage(msg) {
  var itr = msg[1] - 31;
  controls.setIterations(itr);
  lights.forIterations(lc, itr);
}

function handleFocusChange(msg) {
  var num = message.fromNumber(msg),
      itr = state.load(num).iterations;
  controls.setFocus(num);
  lights.forFocus(lc, num);
  lights.forIterations(lc, itr);
}

function recieveMIDIMessage(e) {
  var msg = e.data;
  if (message.isEncoder(msg)) {
    controls.adjustPattern(message.fromEncoder(msg));

  } else if (message.isNumberOn(msg)) {
    handleFocusChange(msg);

  } else if (message.isGridOn(msg) && msg[1] < 48) {
    handleIterationMessage(msg);
  }
}

function registerCMDLC1(input, output) {
  if (input && output) {
    input.onmidimessage = recieveMIDIMessage;
    lc = { input, output };
    lights.forIterations(lc, 8);
    lights.forFocus(lc, 0);
  } else {
    throw 'ERROR: Launchpad MIDI device not found';
  }
}

function initCMDLC1() {
  midiAccess.getDevice(registerCMDLC1, /^CMD LC-1$/);
  controls.init();
}

export default initCMDLC1;
