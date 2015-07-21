'use strict';

var numSynths = 8,
    audioCtxConstructor = (window.AudioContext || window.webkitAudioContext),
    audioCtx   = new audioCtxConstructor(),
    numSamples = Math.pow(2, 19),
    synths     = Array.apply(null, { length: numSynths });

class WavetableSynth {
  constructor() {
    var source = audioCtx.createBufferSource(),
        buffer = audioCtx.createBuffer(2, numSamples, audioCtx.sampleRate);
    this.channels = {};
    this.channels.left  = buffer.getChannelData(0);
    this.channels.right = buffer.getChannelData(1);
    this.metadata = { pattern: [0], iterations: 1 };
    this.worker = { terminate: () => {} };
    source.loop   = true;
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start();
  }

  play(pattern, iterations) {
    this.worker.terminate();
    this.worker = new Worker('worker/cantor.js');
    this.worker.onmessage = (e) => {
      this.update({ pattern, iterations }, e.data);
      console.log('Fractal generated');
    };
    this.worker.postMessage([pattern, iterations]);
  }

  update(metadata, wavetable) {
    this.metadata   = metadata;
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

synths = synths.map(() => new WavetableSynth());

export default { synths, numSamples };