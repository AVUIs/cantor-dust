'use strict';

function isSideButton(note) {
  return !(note <= 104 || note > 111);
}

function isTopButton(note) {
  return [8, 24, 40, 56, 72, 88, 104, 120].includes(note);
}

function isGrid(note) {
  return !(isTopButton(note) || isSideButton(note));
}

function isOnMessage(msg) {
  var velocity = msg[2];
  return velocity === 127;
}

export default { isSideButton, isTopButton, isGrid, isOnMessage };
