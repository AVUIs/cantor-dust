'use strict';

import cantor from 'gui/cantor';

var botCanvas = document.querySelector('canvas.bottom'),
    topCanvas = document.querySelector('canvas.top'),
    botCtx = botCanvas.getContext('2d'),
    topCtx = topCanvas.getContext('2d');

window.ctx = topCtx;

function update(updated, cantorArr) {
  var segmentH = window.innerHeight / 8,
      i   = updated.cantor,
      dim = { x: 0, y: i * segmentH, w: window.innerWidth, h: segmentH };
  cantor.plot(botCtx, cantorArr, dim);
}

function resizeCanvas() {
  botCanvas.width  = window.innerWidth;
  botCanvas.height = window.innerHeight - 4;
  topCanvas.width  = window.innerWidth;
  topCanvas.height = window.innerHeight - 4;
}

window.onresize = resizeCanvas;
resizeCanvas();

export default { update };
