'use strict'

import state  from 'state';

var numSynths = 8,
    synths = Array.apply(null, { length: numSynths } ),
    numSamples = Math.pow(2, 19); 

Gibberish.init();

// First, let's extend the GibberishSampler to run a callback when we want
Gibberish.Sampler.prototype.ontick = (callback) => callback();

class GibberishSamplerSynth {
  constructor(options) {
    var sampler = new Gibberish.Sampler(options);
    
    sampler.loops = true;
    sampler.pitch = 1/8;
    sampler.playOnLoad = sampler.pitch;
    sampler.connect();

    this.sampler = sampler;
    this.mutedvolume = undefined;
    this.id = sampler.id;

    
    // a little hacky, but this is what Gibberish gives us
    var sequencer = new Gibberish.Sequencer({
      target:sampler,    // attach to the sampler, 
      key:'ontick',      // ... and invoke its ontick method
      durations:[100], // ... every this many samples
      values: [ () => { return () => { state.load(sampler.id).phase = sampler.getPhase(); } } ], // ... with a function that returns a function which the ontick method will invoke
      shouldKeepOffset: true //TODO should i keep this?
    });
    
    this.sequencer = sequencer;
    
  }

  set wavetable(samples) {
    this.sampler.setBuffer(samples);
    this.sampler.length = samples.length;
    //this.sampler.note(this.sampler.pitch);
    if (!this.sequencer.isRunning)
      this.sequencer.start();
  }

  get wavetable() {
    return [this.sampler.getBuffer(), this.sampler.getBuffer()];
  }

  playRatechange(factor) {
    this.sampler.pitch *= factor;
    state.load(this.id).pitch = this.sampler.pitch;
    return this.sampler.pitch;
  }

  set volume(value) {
    state.load(this.id).amp = this.sampler.amp;
    this.sampler.amp = value;
  }

  get volume() {
    return this.sampler.amp;
  }

  togglemute() {
    if (this.mutedvolume === undefined) {
      this.mutedvolume = this.volume;
      this.volume = 0.0;
    }
    else {
      this.volume = this.mutedvolume;
      this.mutedvolume = undefined;
    }      
  }
}


function loadSynthParamsFromState() {
  synths = synths.map( (synth,i) => {
    var stateI = state.load(synth.id);
    if (stateI.amp)
      synth.volume = stateI.amp;
    if (stateI.pitch)
      synth.sampler.pitch = stateI.pitch;
    if (stateI.phase)
      synth.sampler.setPhase(stateI.phase);	
  });
}

synths = synths.map((e,i) => new GibberishSamplerSynth({id:i}));

export default { synths, loadSynthParamsFromState, numSamples };

    
	
  
