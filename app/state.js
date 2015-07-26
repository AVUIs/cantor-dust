'use strict';

var state = [];

function save(i, data) {
  state[i] = data;
}

function load(i) {
  return state[i] || { iterations: 8, pattern: [0,0,0,0] };
}

export default { save, load };
