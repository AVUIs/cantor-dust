'use strict';

var botCanvas = document.querySelector('canvas.bottom'),
    topCanvas = document.querySelector('canvas.top'),
    botCtx = botCanvas.getContext('2d'),
    topCtx = topCanvas.getContext('2d');


function update() {
  console.log('Updating GUI');
}

function resizeCanvas() {
  botCanvas.width  = window.innerWidth;
  botCanvas.height = window.innerHeight - 4;
  topCanvas.width  = window.innerWidth;
  topCanvas.height = window.innerHeight - 4;
}

window.onresize = resizeCanvas;
resizeCanvas();

setTimeout(function() {
  botCtx.fillStyle = '#fff';
  botCtx.fillRect(30, 15, 150, 100);
  topCtx.fillStyle = 'hotpink';
  topCtx.fillRect(50, 25, 150, 100);
}, 200);

export default { update };
