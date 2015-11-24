'use strict';

//import {synths,numSamples} from 'native-audio';
//import {synths,numSamples} from 'gibberish-audio';
import {synths,numSamples} from 'new-audio';

import state from 'state';


function loadSynthParamsFromState(ids = [], params = ["amp","pitch","phase"]) {
  ids.map( (id) => {
    var stateI = state.load(id),
	synthI = synths[id];

    params.forEach( (param,i) => {
      if (stateI[param]) synthI[param] = stateI[param];
    });    
  });
}

function synth(i, fn) {
  return fn(synths[i]);
}

function focusedSynth(fn) {
  return fn(synths[state.focus]);
}

function allSynths(fn) {
  return synths.map( (s,i) => fn(s) );
}

function allSynthsButFocused(fn) {
  return synths.map( (s,i) => { if (s.id != state.focus) fn(s); } );
}

export default { synths, numSamples, loadSynthParamsFromState, focusedSynth, allSynths, allSynthsButFocused };
