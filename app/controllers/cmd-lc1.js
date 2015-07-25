'use strict';

import midiAccess from 'midi';
import message    from 'controllers/cmd-lc1/message';

var lc;

function recieveMIDIMessage(e) {
  var msg = e.data;
  if (message.isEncoder(msg)) {
    console.log(message.fromEncoder(msg));
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
}

export default initCMDLC1;
