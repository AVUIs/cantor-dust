'use strict';

var audioCtxConstructor = (window.AudioContext || window.webkitAudioContext),
    audioCtx = new audioCtxConstructor(),
    sources  = [],
    fractal  = [0],
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
  console.log("done");
}


function generate(pattern, iterations) {
  console.log('Generating fractal...');
  var worker = new Worker('worker/fractal.js');
  worker.onmessage = function(e) {
    fractal = e.data;
    console.log('Wavetable ready!');
  };
  worker.postMessage([pattern, iterations]);
}

// Swaps the waiting wavetable for the playing wavetable for source `i`
// Because it swaps you can effectively undo your decision by running it again
function load(i) {
  var previous,
      next   = fractal,
      source = sources[i];
  if (source) {
    previous = source.buffer.getChannelData(0);
    fractal  = previous;
  }
  play(i, next);
}

window.sources = sources;

export default { generate, load };
