'use strict';

import audio from 'audio'
import gui   from 'gui';
import state from 'state';
import config from 'config'

var debouncedTimeouts = [],
    workers = [];

function updateSynthAndGUI(i, data) {
  var cantor    = data.cantor,
      wavetable = cantor[cantor.length - 1];
  state.save(i, data);
  audio.synths[i].wavetable = wavetable;

  if (config.params.AUDIO.resetPhaseOnNewBuffer) {    
    state.load(i).phase = 0;
    audio.synths[i].phase = 0;
  }
  
  gui.updateIterations(i, data.iterations); //BE-raf:to-remove
  gui.updateCantor(i, cantor); //BE-raf:to-remove
}

function resetWorker(i, cb) {
  if (workers[i] && workers[i].terminate) {
    workers[i].terminate();
  }
  workers[i] = new Worker('worker/cantor.js');
  workers[i].onmessage = cb;
}

function play(i, pattern, iterations) {
  var cb,
      data = { pattern, iterations };
  cb = function(e) {
    data.cantor = e.data;
    updateSynthAndGUI(i, data);
  };
  resetWorker(i, cb);
  workers[i].postMessage([pattern, iterations]);
}

function playDebounced(i, pattern, iterations, timeout = 250) {
  clearTimeout(debouncedTimeouts[i]);
  debouncedTimeouts[i] = setTimeout(
    () => play(i, pattern, iterations),
    timeout
  );
}

function togglemute(i) {
  audio.synths[i].togglemute();
}

function volume(i, value, isdelta) {
  var vol = audio.synths[i].volume;
  
  if (isdelta)
    vol = vol + value;
  else
    vol = value;
  
  if (vol < 0.0)
    vol = 0;
  if (vol > 10.0)
    vol = 10.0;
  
  audio.synths[i].volume = vol;
}

function playRatechange(i, factor) {
  audio.synths[i].playRatechange(factor);  
}

export default { play, playDebounced, volume, togglemute, playRatechange };
