'use strict';

function isSideButton(note) {
  return !(note <= 104 || note > 111);
}

function isTopButton(note) {
  switch (note) {
    case   8: return true;
    case  24: return true;
    case  40: return true;
    case  56: return true;
    case  72: return true;
    case  88: return true;
    case 104: return true;
    case 120: return true;
    default:  return false;
  }
}

function isGrid(note) {
  return !(isTopButton(note) || isSideButton(note));
}

function isOnMessage(msg) {
  var velocity = msg[2];
  return velocity === 127;
}

export default { isSideButton, isTopButton, isGrid, isOnMessage };
