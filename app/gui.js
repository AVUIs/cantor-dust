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
  cantor.plot(ctx, cantorArr, dim(i), /*withcolors*/ true);
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
  //  console.log(n, i, x, y, w, h, sw);
  
  ctx.fillStyle = 'black';
  ctx.fillRect(x - w + sw, y, w, segmentH);

  ctx.fillStyle = 'grey';

  // if this is the focused generator, have it stand out a little
  if (n == state.focus)
    ctx.fillStyle = 'white';

  // Display the number of the generator on the right
  //ctx.font         = '22px monospace';
  ctx.fillText(n+1 ,x+50, y+segmentH/2);
  
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
    
    // redraw the sliders too
    updateSliders(i,stateI.pattern);
  }
}

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight - 4;
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight - 4;
}

window.onresize = resizeCanvas;
resizeCanvas();

export default { updateCantor, updateIterations, updateSliders };
