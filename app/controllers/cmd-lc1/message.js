'use strict';

function isOn(msg) {
  return msg[0] === 144 && msg[2] === 127;
}

function isEncoder(msg) {
  var x = msg[0],
      y = msg[1];
  return x === 176 && (y >= 16 || y <= 23);
}

function fromEncoder(msg) {
  var encoder = msg[1] - 16,
      change  = msg[2] - 64;
  return { encoder, change };
}


function isNumberOn(msg) {
  var y = msg[1];
  return isOn(msg) && y >= 16 && y <= 23;
}

function fromNumber(msg) {
  return msg[1] - 16;
}

function toNumber(n) {
  return n + 16;
}


function isRecOn(msg) {
  var y = msg[1];
  return isOn(msg) && y >= 72 && y <= 75;
}

function fromRecOn(msg) {
  return msg[1] - 16;
}


function isGridOn(msg) {
  var y = msg[1];
  return isOn(msg) && y >= 32 && y <= 63;
}


function gridNoteFromXY([x, y]) {
  y = Math.abs((y - 15) * 4);
  return y + x;
}
function fromGrid(msg) {
  var a = msg[1],
      x = a % 4,
      y = Math.abs(Math.floor(a / 4) - 15);
  return [x, y];
}


export default {
  isEncoder,      fromEncoder,
  isNumberOn,     fromNumber,  toNumber,
  isRecOn,        fromRecOn,
  isGridOn,       fromGrid,
  gridNoteFromXY,
};
