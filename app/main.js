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
import audio from 'gibberish-audio';

// window.state = state;
// window.controls = controls;

// Recreate the state from the URL
if (state.loadFromURL()) {
  // initialise the controls from the state
  controls.init();
  // load synth parameters (amp, pitch, phase, etc) from the state
  audio.loadSynthParamsFromState();
  // force cantor data regeneration and play
  state.getActiveStateIds().map( (id, i) => { controls.setFocus(id); controls.adjustPattern({encoder: id, change: 0}) } );
}


