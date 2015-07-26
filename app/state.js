'use strict';

var state = [];

function save(i, data) {
  state[i] = data;
}

function load(i) {
  return state[i] || { iterations: 8 };
}

export default { save, load };
