'use strict';

import midiAccess from 'midi';
import message    from 'controllers/cmd-lc1/message';
import controls   from 'controllers/cmd-lc1/controls';
import lights     from 'controllers/cmd-lc1/lights';
import player     from 'player';
import state      from 'state';
import gui        from 'gui';

var lc;

function handleEncoder(msg) {
  var val = message.fromEncoder(msg),
      [i, pat] = controls.adjustPattern(val);
  lights.forPattern(lc, pat);
  gui.updateSliders(i, pat);
}

function handleIterationMessage(msg) {
  var itr = msg[1] - 31;
  controls.setIterations(itr);
  lights.forIterations(lc, itr);
}

function handleQuietenMessage(msg) {
  var i = msg[1] - 48,
      st = state.load(i),
      pat = st.pattern.map((e) => e * 0.95);
  st.pattern = pat;
  state.save(i, st);
  player.playDebounced(i, st.pattern, st.iterations, 150);
  lights.forPattern(lc, pat);
  gui.updateSliders(i, pat);
}

function handleFocusChange(msg) {
  var num = message.fromNumber(msg),
      sta = state.load(num),
      pat = sta.pattern,
      itr = sta.iterations;
  controls.setFocus(num);
  lights.forFocus(lc, num);
  lights.forIterations(lc, itr);
  lights.forPattern(lc, pat);
}

function recieveMIDIMessage(e) {
  var msg = e.data;
  if (message.isEncoder(msg)) {
    handleEncoder(msg);

  } else if (message.isNumberOn(msg)) {
    handleFocusChange(msg);

  } else if (message.isGridOn(msg)) {
    if(msg[1] < 48) {
      handleIterationMessage(msg);
    } else {
      handleQuietenMessage(msg);
    }
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
