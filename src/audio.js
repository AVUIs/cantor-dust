'use strict';

var audioCtxConstructor = (window.AudioContext || window.webkitAudioContext),
    audioCtx = new audioCtxConstructor(),
    nSamples = Math.pow(2, 19),
    sources  = [],
    buffers  = [],
    fractal  = [0],
    i = 8;

(function() {
  var source, buffer, left, right;
  while (i--) {
    source = audioCtx.createBufferSource();
    buffer = audioCtx.createBuffer(2, nSamples, audioCtx.sampleRate);
    left   = buffer.getChannelData(0);
    right  = buffer.getChannelData(1);
    buffers[i] = [left, right];
    source.loop   = true;
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start();
  }
}());


function generate(i, pattern, iterations) {
  var worker = new Worker('worker/fractal.js');
  worker.onmessage = function(e) {
    console.log('Fractal generated');
    load(i, e.data);
  };
  worker.postMessage([pattern, iterations]);
}

function load(num, frames) {
  var [left, right] = buffers[num],
      framesLen = frames.length,
      len, i;
  for (i = 0, len = left.length; i < len; i++) {
    left[i]  = frames[i % framesLen];
    right[i] = frames[i % framesLen];
  }
}

export default { generate };
