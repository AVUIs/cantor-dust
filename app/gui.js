'use strict';

import cantor from 'gui/cantor';
import state  from 'state';

var canvas = document.querySelector('canvas'),
    ctx    = canvas.getContext('2d'),
    segmentH = window.innerHeight / 8;

function dim(i) {
  return { x: 0, y: i * segmentH, w: window.innerWidth - 150, h: segmentH };
}

function updateCantor(i, cantorArr) {
  cantor.plot(ctx, cantorArr, dim(i));
}

function updateIterations(i, iterations) {
  var y = i * segmentH + 5,
      x = window.innerWidth - 5;
  ctx.clearRect(x - 25, y, 25, 22);
  ctx.textBaseline = 'hanging';
  ctx.textAlign    = 'right';
  ctx.fillStyle    = 'grey';
  ctx.font         = '22px monospace';
  ctx.fillText(iterations, x, y);
}

// Sorry...
function updateSliders(n, params) {
  var i = params.length,
      x = Math.ceil(window.innerWidth - 70),
      y = n * segmentH,
      w = 95,
      h = segmentH,
      sw = Math.floor(w / i),
      sh;
  ctx.fillStyle = 'black';
  ctx.fillRect(x - w + sw, y, w, segmentH);
  ctx.fillStyle = 'grey';
  while (i--) {
    sh = 0 - (h * params[i]);
    ctx.fillRect(x + 1, y + h, sw - 1, sh);
    x -= sw;
  }
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

export default { updateCantor, updateIterations, updateSliders };
