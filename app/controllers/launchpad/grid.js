'use strict';

// Grid starts bottom left

function fromNote(note) {
  var x = Math.floor(note / 16),
      y = note % 16;
  return [x, y];
}
function toNote(x, y) {
  return x * 16 + y;
}

export default { fromNote, toNote };
