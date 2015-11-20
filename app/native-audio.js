'use strict';

import state from 'state';

var numSynths = 8,
    audioCtxConstructor = (window.AudioContext || window.webkitAudioContext),
    audioCtx   = new audioCtxConstructor(),
    numSamples = Math.pow(2, 19),
    synths     = Array.apply(null, { length: numSynths });


class WavetableSynth {
  constructor(options) {
    // forward compatilibity
    this.id = options.id;
    var source = audioCtx.createBufferSource(),
        buffer = audioCtx.createBuffer(2, numSamples, audioCtx.sampleRate);
    var mutedvolume = undefined;
    this.channels = {
      left:  buffer.getChannelData(0),
      right: buffer.getChannelData(1),
    };
    this.source = source;
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

    //console.log(numFrames /*2^14*/, left.length /*2^19*/);
    
    for (i = 0, len = left.length; i < len; i++) {
      left[i]  = samples[i % numFrames];
      right[i] = samples[i % numFrames];
    }
  }
  get wavetable() {
    return [this.channels.left, this.channels.right];
  }


  // forward compatibility
  set pitch(pitch) {
    this.source.playbackRate.value = pitch;
    state.load(this.id).pitch = pitch;
  }

  // forward compatibility
  get pitch() {
    return this.source.playbackRate
  }

  
  playRatechange(factor) {
    var rate = this.source.playbackRate.value;
    rate *= factor;
    // if (rate > 1)
    //   rate = 1;
    this.source.playbackRate.value = rate;
    state.load(this.id).pitch = rate;
    return rate;
  }
    
  // forward compatibility
  set amp(value) {
    this.volume = value;
    state.load(this.id).amp = value;
  }

  // forward compatibility
  get amp() {
    return this.volume;
  }

  
  set volume(value) {
    this.gain.gain.value = value;
  }
  get volume() {
    return this.gain.gain.value;
  }
  
  togglemute() {
    if (this.mutedvolume === undefined) {
      this.mutedvolume = this.gain.gain.value;
      this.gain.gain.value = 0.0;
    }
    else {
      this.gain.gain.value = this.mutedvolume;
      this.mutedvolume = undefined;
    }      
  }

  // forward compatilibity
  set phase(phase) {
  }
  get phase() {
    return 0;
  }
}

synths = synths.map((e,i) => new WavetableSynth({id:i}));

export default { synths, numSamples };

