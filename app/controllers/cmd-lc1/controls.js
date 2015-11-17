'use strict';

import player from 'player';
import state  from 'state';
import gui    from 'gui';

var MAXITERATIONS = 8;
var MINITERATIONS = 1;
    
var focused  = 0,
    stepSize = 0.03,
    controls = [];

function save(i, data) {
  controls[i] = data;
}

function load(i) {
  return controls[i];
}


function init() {
  var i = 8;

  // initialise the default focus first
  controls[focused] = state.load(focused);
  setFocus(focused);

  while (i--) { controls[i] = state.load(i); setFocus(i); }
}

function setFocus(i) {
  //  console.log(`Focused ${i}`);
  
  var oldfocus = focused;
  
  focused = i;
  state.focus = focused;

  // console.log(oldfocus, controls[oldfocus].pattern);
  // console.log(focused,controls[focused].pattern);
  
  gui.updateSliders(oldfocus,controls[oldfocus].pattern);
  gui.updateSliders(focused,controls[focused].pattern);
  
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
  player.playDebounced(focused, ctr.pattern, ctr.iterations, 50 /*BE 200*/);


  return [focused, pattern];
}

function restartFocused() {
  adjustPattern({encoder: focused, change: 0});
}

function invertFocusedPattern() {
  var ctr = controls[focused],
      pattern = ctr.pattern;

  ctr.pattern = pattern.map((v) => 1.0 - v);
  state.load(focused).pattern = pattern;

  gui.updateSliders(focused,ctr.pattern);
  restartFocused();
}

function resetFocusedPattern() {
  var ctr = controls[focused],
      pattern = ctr.pattern;
  
  ctr.pattern = [0.5,0.5,0.5,0.5];
  state.load(focused).pattern = pattern;

  gui.updateSliders(focused,ctr.pattern);
  restartFocused();  
}

function setIterations(itr, isdelta) {
  var s = state.load(focused);
  s.iterations = isdelta ? s.iterations + itr : itr;
  if (s.iterations > MAXITERATIONS) s.iterations = MAXITERATIONS;
  if (s.iterations < MINITERATIONS) s.iterations = MINITERATIONS;
  state.save(focused, s);
  controls[focused].iterations = s.iterations;
  gui.updateIterations(focused, s.iterations);
}



export default { init, load, save, setFocus, adjustPattern, resetFocusedPattern, invertFocusedPattern, restartFocused, setIterations,  };
