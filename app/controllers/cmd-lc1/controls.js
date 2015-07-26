'use strict';

import player from 'player';

var focused  = 0,
    stepSize = 0.02,
    controls = Array.apply(null, { length: 8 });

function setFocus(i) {
  focused = i;
}

// Takes an encoder object { encoder: index, change: (1|-1) }
// and increments or decrements the matching pattern segment
//
function adjustPattern(msg) {
  var pattern = controls[focused].pattern,
      val;
  if (pattern[msg.encoder] !== undefined) {
    val = pattern[msg.encoder] + stepSize * msg.change;
    val = Math.min(1, val);
    val = Math.max(0, val);
    pattern[msg.encoder] = val;
  }
  console.log(pattern);
}

function apply() {
  var ctr = controls[focused];
  player.play(focused, ctr.pattern, ctr.iterations);
}


controls = controls.map(function() {
  return { iterations: 8, pattern: [0, 0, 0, 0] };
});

export default { setFocus, adjustPattern, apply };
