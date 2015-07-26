'use strict';

import cantor from 'gui/cantor';
import state  from 'state';

var canvas = document.querySelector('canvas.top'),
    ctx    = canvas.getContext('2d'),
    segmentH = window.innerHeight / 8;

function dim(i) {
  return { x: 0, y: i * segmentH, w: window.innerWidth - 200, h: segmentH };
}

function updateCantor(i, cantorArr) {
  cantor.plot(ctx, cantorArr, dim(i));
}

function updateAll() {
  var stateI,
      i = 8;
  while (i--) {
    stateI = state.load(i);
    if (stateI.cantor !== undefined) {
      updateCantor(i, stateI.cantor);
    }
  }
}

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight - 4;
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight - 4;
  updateAll();
}

window.onresize = resizeCanvas;
resizeCanvas();

export default { updateCantor };
