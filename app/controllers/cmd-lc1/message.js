'use strict';

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
  var [x, y, z] = msg;
  return x === 144 && z === 127 && y >= 16 && y <= 23;
}

function fromNumberOn(msg) {
  return msg[1] - 16;
}

export default { isEncoder, fromEncoder, isNumberOn, fromNumberOn };
