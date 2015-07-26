'use strict';

import cantor from 'gui/cantor';
import state  from 'state';

var canvas = document.querySelector('canvas'),
    ctx    = canvas.getContext('2d'),
    segmentH = window.innerHeight / 8;

function dim(i) {
  return { x: 0, y: i * segmentH, w: window.innerWidth - 200, h: segmentH };
}

function updateCantor(i, cantorArr) {
  cantor.plot(ctx, cantorArr, dim(i));
}

function updateIterations(i, iterations) {
  var y = i * segmentH + 5,
      x = window.innerWidth - 5;
  ctx.fillStyle = 'black';
  ctx.fillRect(44, 44, x - 44, y - 44);
  ctx.textBaseline = 'hanging';
  ctx.textAlign    = 'right';
  ctx.fillStyle    = 'grey';
  ctx.font         = '22px monospace';
  ctx.fillText(iterations, x, y);
}

function updateAll() {
  var stateI,
      i = 8;
  while (i--) {
    stateI = state.load(i);
    if (stateI.cantor !== undefined) {
      updateCantor(i, stateI.cantor);
    }
    if (stateI.iterations !== undefined) {
      updateIterations(i, stateI.iterations);
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

export default { updateCantor, updateIterations };
