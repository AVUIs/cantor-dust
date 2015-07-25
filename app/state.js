'use strict';

var state = [];

function save(i, data) {
  state[i] = data;
}

function load(i) {
  return state[i] || {};
}

export default { save, load };
