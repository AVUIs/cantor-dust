'use strict';

import state from 'state';

var numSynths = 8,
    audioCtxConstructor = (window.AudioContext || window.webkitAudioContext),
    audioCtx   = new audioCtxConstructor(),
    numSamples = Math.pow(2, 19),
    synths     = Array.apply(null, { length: numSynths });


function createBufferSource(audioCtx, type = "SPAudioBufferSourceNode") {
  if (type === "SPAudioBufferSourceNode") {
    return new SPAudioBufferSourceNode(audioCtx);
  } else if (type === "AudioBufferSourceNode") {
    return audioCtx.createBufferSource();
  } else {
    return audioCtx.createBufferSource();
  }    
}

function createBuffer(audioCtx, numSamplesOrSamplesArray, numChannels = 2 , sampleRate = audioCtx.sampleRate) {
  if (typeof numSamplesOrSamplesArray === "number") {
    return audioCtx.createBuffer(numChannels, numSamplesOrSamplesArray, sampleRate);
  } else if (Array.isArray(numSamplesOrSamplesArray)) {
    var samples = numSamplesOrSamplesArray,
	numSamples = samples.length,
	buffer = audioCtx.createBuffer(numChannels, numSamples, sampleRate),
	channels = [];    
    for (var i=0; i<numChannels; i++) {
      channels[i] = buffer.getChannelData(i);
    }
    for (var j=0; j<numSamples; j++) {
      for (var i=0; i<numChannels; i++) {
	channels[i][j] = samples[j];
      }
    }
    return buffer;
  } else {
    return null;
  }
  
}


class WavetableSynth {
  constructor(options) {
    // forward compatilibity
    this.id = options.id;
    this.bufferSourceNodeType = options.bufferSourceNodeType || "AudioBufferSourceNode";
    
    var source = createBufferSource(audioCtx, this.bufferSourceNodeType),
        buffer = createBuffer(audioCtx, numSamples, 2, audioCtx.sampleRate);
    
    this.source = source;
    source.buffer = buffer;
    source.loop   = true;
    source.playbackRate.value = 1 / 8;

    this.gain = audioCtx.createGain();
    source.connect(this.gain);
    this.gain.connect(audioCtx.destination);
    this.mutedvolume = undefined;

    source.start();
  }

  
  set wavetable(samples) {
    if (this.source)
      this.source.disconnect();
    
    var source = createBufferSource(audioCtx, this.bufferSourceNodeType);

    if (samples instanceof AudioBuffer) {
      source.buffer = samples;
    } else if (Array.isArray(samples)) {
      source.buffer = createBuffer(audioCtx, samples, 2, audioCtx.sampleRate);
    }
    else {
      source.buffer = this.source.buffer;
    }
    
    source.loop = this.source.loop;
    source.playbackRate.value = this.source.playbackRate.value;
    if (source.playbackPosition && this.source.playbackPosition)
      source.playbackPosition = this.source.playbackPosition;
  
    source.connect(this.gain);

    this.source = source;

    source.start();
  }
  
  get wavetable() {
    var buffer = this.source.buffer;
    return [buffer.getChannelData(0), buffer.getChannelData(1)];
  }


  // forward compatibility
  set pitch(pitch) {
    this.source.playbackRate.value = pitch;
    state.load(this.id).pitch = pitch;
  }

  // forward compatibility
  get pitch() {
    return this.source.playbackRate;
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
    this.wavetable = this.source.buffer;
  }
  get phase() {
    return this.source.playbackPosition || "undefined";
  }
  
}

synths = synths.map((e,i) => new WavetableSynth({id:i}));

export default { synths, numSamples };

