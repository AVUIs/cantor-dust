'use strict';

var numSynths = 8,
    audioCtxConstructor = (window.AudioContext || window.webkitAudioContext),
    audioCtx   = new audioCtxConstructor(),
    numSamples = Math.pow(2, 19),
    synths     = Array.apply(null, { length: numSynths });

class CantorSynth {
  constructor() {
    var source = audioCtx.createBufferSource(),
        buffer = audioCtx.createBuffer(2, numSamples, audioCtx.sampleRate);
    this.channels = {};
    this.channels.left  = buffer.getChannelData(0);
    this.channels.right = buffer.getChannelData(1);
    this.configData = { pattern: [0], iterations: 1 };
    source.loop   = true;
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start();
  }

  update(configData, wavetable) {
    this.configData = configData;
    this.bufferData = wavetable;
  }

  set bufferData(wavetable) {
    loadWavetables(wavetable, this.channels.left, this.channels.right);
  }
  get bufferData() {
    return [this.channels.left, this.channels.right];
  }
}

function loadWavetables(samples, left, right) {
  var numFrames = samples.length,
      len, i;
  for (i = 0, len = left.length; i < len; i++) {
    left[i]  = samples[i % numFrames];
    right[i] = samples[i % numFrames];
  }
}

function generate(i, pattern, iterations) {
  var worker = new Worker('worker/fractal.js');
  worker.onmessage = function(e) {
    var config = { pattern, iterations };
    synths[i].update(config, e.data);
    console.log('Fractal generated');
  };
  worker.postMessage([pattern, iterations]);
}


synths = synths.map(() => new CantorSynth());

export default { generate, synths, numSamples };
