'use strict';

var audioContext = (window.AudioContext || window.webkitAudioContext),
    audioCtx = new audioContext();

function play(rawData) {

  var frames = rawData.length,
      buffer = audioCtx.createBuffer(2, frames, audioCtx.sampleRate),
      source = audioCtx.createBufferSource(),
      left   = buffer.getChannelData(0),
      right  = buffer.getChannelData(1);

  // Load the left and right channels with our audio data
  while (frames--) {
    left[frames]  = rawData[frames];
    right[frames] = rawData[frames];
  }

  // Play our buffer
  source.loop   = true;
  source.buffer = buffer;
  source.connect(audioCtx.destination);
  source.start();
}

window.makeNoise = function makeNoise(pattern, iterations) {
  var worker = new Worker('worker/fractal.js');
  worker.onmessage = function(e) { play(e.data); };
  worker.postMessage([pattern, iterations]);
};
