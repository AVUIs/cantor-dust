'use strict';

import player from 'player';
import state  from 'state';
import gui    from 'gui';
import lights from 'controllers/cmd-lc1/lights';

var focused  = 0,
    stepSize = 0.02,
    controls = [];

function init() {
  var i = 8;
  while (i--) { controls[i] = state.load(i); }
}

function setFocus(i) {
  console.log(`Focused ${i}`);
  focused = i;
}

// Takes an encoder object { encoder: index, change: (1|-1) }
// and increments or decrements the matching pattern segment
//
function adjustPattern(msg) {
  var ctr = controls[focused],
      pattern = ctr.pattern,
      val;
  if (pattern[msg.encoder] !== undefined) {
    val = pattern[msg.encoder] + stepSize * msg.change;
    val = Math.min(1, val);
    val = Math.max(0, val);
    pattern[msg.encoder] = val;
  }
  player.playDebounced(focused, ctr.pattern, ctr.iterations, 200);
}

function setIterations(lc, itr, note) {
  var s = state.load(focused);
  s.iterations = itr;
  state.save(focused, s);
  controls[focused].iterations = itr;
  gui.updateIterations(focused, itr);
  lights.forIterations(lc, note);
}


export default { init, setFocus, adjustPattern, setIterations };
