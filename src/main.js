'use strict';

var audioCtxConstructor = (window.AudioContext || window.webkitAudioContext),
    audioCtx = new audioCtxConstructor(),
    sources  = [],
    i = 8;

function play(i, rawData) {

  var source = audioCtx.createBufferSource(),
      oldSrc = sources[i],
      frames = rawData.length,
      buffer = audioCtx.createBuffer(2, frames, audioCtx.sampleRate),
      left   = buffer.getChannelData(0),
      right  = buffer.getChannelData(1);

  // Load the left and right channels with our audio data
  while (frames--) {
    left[frames]  = rawData[frames];
    right[frames] = rawData[frames];
  }
  if (oldSrc) {
    oldSrc.stop();
  }

  // Play our buffer
  source.loop   = true;
  source.buffer = buffer;
  source.connect(audioCtx.destination);
  source.start();
  sources[i] = source;
}

window.makeNoise = function makeNoise(bufferI, pattern, iterations) {
  var worker = new Worker('worker/fractal.js');
  worker.onmessage = function(e) { play(bufferI, e.data); };
  worker.postMessage([pattern, iterations]);
};
