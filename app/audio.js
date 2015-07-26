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
    this.channels = {
      left:  buffer.getChannelData(0),
      right: buffer.getChannelData(1),
    };
    this.gain = audioCtx.createGain();
    source.playbackRate.value = 1 / 8;
    source.loop   = true;
    source.buffer = buffer;
    source.connect(this.gain);
    this.gain.connect(audioCtx.destination);
    source.start();
  }

  set wavetable(samples) {
    var numFrames = samples.length,
        left  = this.channels.left,
        right = this.channels.right,
        len, i;
    for (i = 0, len = left.length; i < len; i++) {
      left[i]  = samples[i % numFrames];
      right[i] = samples[i % numFrames];
    }
  }
  get wavetable() {
    return [this.channels.left, this.channels.right];
  }

  set volume(value) {
    this.gain.gain.value = value;
  }
  get volume() {
    return this.gain.gain.value;
  }
}

synths = synths.map(() => new WavetableSynth());

export default { synths, numSamples };
