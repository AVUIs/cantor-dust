'use strict';

import player from 'player';
window.player        = player;
window.play          = player.play;
window.playDebounced = player.playDebounced;

import initLaunchpad     from 'controllers/launchpad';
import initLaunchControl from 'controllers/novation-launchcontrol';
import initCMDLC1        from 'controllers/cmd-lc1';
import initKeyboard      from 'controllers/keyboard';
window.initLaunchpad     = initLaunchpad;
window.initLaunchControl = initLaunchControl;
window.initCMDLC1        = initCMDLC1;
window.initKeyboard      = initKeyboard;

initKeyboard();

import { availableDevices } from 'midi';
window.availableDevices = availableDevices;

import state from 'state';
import gui from 'gui';
import controls from 'controllers/cmd-lc1/controls';
//BE-audio import audio from 'gibberish-audio';
import audio from 'audio';
window.audio = audio;
window.state = state;
// window.controls = controls;

// Recreate the instrument state from the URL
if (state.loadFromURL()) {
  
  // initialise (all) the controls from the state
  controls.init();

  // these are the states that have been initialised
  var activeStateIds = state.getActiveStateIds();
  
  // load synth parameters (amp, pitch, phase, etc) from the states
  audio.loadSynthParamsFromState(activeStateIds);
  
  // force cantor data re-generation and play
  activeStateIds.map( (id, i) => { controls.setFocus(id); controls.adjustPattern({encoder: id, change: 0}) } );
}


