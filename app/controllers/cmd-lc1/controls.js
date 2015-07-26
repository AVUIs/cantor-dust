'use strict';

import player from 'player';
import state  from 'state';
import gui    from 'gui';

var focused  = 0,
    stepSize = 0.02,
    controls = Array.apply(null, { length: 8 });

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

function adjustIterations(change) {
  var s   = state.load(focused),
      itr = s.iterations + change;
  s.iterations = itr;
  state.save(focused, s);
  controls[focused].iterations = itr;
  gui.updateIterations(focused, itr);
}

window.foo = adjustIterations;

controls = controls.map(function() {
  return { iterations: 8, pattern: [0, 0, 0, 0] };
});

export default { setFocus, adjustPattern, adjustIterations };
