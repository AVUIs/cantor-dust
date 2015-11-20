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
    // Disabled because it turns out we can meaningfully poll the phase via requestAnimationFrame
    // var sequencer = new Gibberish.Sequencer({
    //   target:sampler,    // attach to the sampler, 
    //   key:'ontick',      // ... and invoke its ontick method
    //   durations:[100], // ... every this many samples
    //   values: [ () => { return () => { state.load(sampler.id).phase = sampler.getPhase(); } } ], // ... with a function that returns a function which the ontick method will invoke
    //   shouldKeepOffset: true //TODO should i keep this?
    // });
    
    // this.sequencer = sequencer;
    
  }

  set wavetable(samples) {
    this.sampler.setBuffer(samples);
    this.sampler.length = samples.length;
    //this.sampler.note(this.sampler.pitch);

    // if (!this.sequencer.isRunning)
    //   this.sequencer.start();
  }

  get wavetable() {
    return [this.sampler.getBuffer(), this.sampler.getBuffer()];
  }


  set pitch(pitch) {
    this.sampler.pitch = pitch;
    state.load(this.id).pitch = pitch;
  }

  get pitch() {
    return this.sampler.pitch;
  }
  
  playRatechange(factor) {
    this.sampler.pitch *= factor;
    state.load(this.id).pitch = this.sampler.pitch;
    return this.sampler.pitch;
  }



  set amp(value) {
    state.load(this.id).amp = this.sampler.amp;
    this.sampler.amp = value;
  }

  get amp() {
    return this.sampler.amp;
  }

  // backwards compatibility
  set volume(value) {
    this.amp = value;
  }
  
  // backwards compatibility
  get volume() {
    return this.amp;
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

  set phase(phase) {
    this.sampler.setPhase(phase);
//    state.load(this.id).phase = this.sampler.phase;
  }
    
  get phase() {
    return this.sampler.getPhase();
  }
}


synths = synths.map((e,i) => new GibberishSamplerSynth({id:i}));

export default { synths, numSamples };

    
	
  
