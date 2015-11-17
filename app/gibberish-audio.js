'use strict'

var numSynths = 8,
    synths = Array.apply(null, { length: numSynths } ),
    numSamples = Math.pow(2, 19); 

Gibberish.init();


class GibberishSamplerSynth {
  constructor() {
    var sampler = new Gibberish.Sampler();
    
    sampler.loops = true;
    sampler.connect();
    sampler.note(1/8);
    
    this.sampler = sampler;
    this.mutedvolume = undefined;
  }

  set wavetable(samples) {
    this.sampler.setBuffer(samples);
    this.sampler.length = samples.length;
  }

  get wavetable() {
    return [this.sampler.getBuffer(), this.sampler.getBuffer()];
  }

  playRatechange(factor) {
    this.sampler.pitch *= factor;
    return this.sampler.pitch;
  }

  set volume(value) {
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


synths = synths.map(() => new GibberishSamplerSynth());

export default { synths, numSamples };

    
	
  
