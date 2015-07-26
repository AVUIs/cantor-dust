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

function fromNumberOn(msg) {
  return msg[1] - 16;
}

function isRecOn(msg) {
  var y = msg[1];
  return isOn(msg) && y >= 72 && y <= 75;
}

function fromRecOn(msg) {
  return msg[1] - 16;
}

export default {
  isEncoder,  fromEncoder,
  isNumberOn, fromNumberOn,
  isRecOn,    fromRecOn,
};
