'use strict';

var state = [],
    focus = undefined,
    buffer = undefined;

function save(i, data) {
  state[i] = data;
}

function load(i) {
  return state[i] || { iterations: 7, pattern: [0.5,0.5,0.5,0.5], phase:undefined, lastphaseOnScreen:undefined };
}

function copytobuffer(i) {
  buffer = Object.assign ({}, state[i]);
  buffer.phase = buffer.lastphaseOnScreen = undefined; // don't copy these for now
}

function savefrombuffer(i) {
  if (!buffer) return false;
  state[i] = buffer;
  state[i].pattern = buffer.pattern.slice(0);
  return state[i];
}

export default { save, load, focus, copytobuffer, savefrombuffer };
