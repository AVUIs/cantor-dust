'use strict';

import midi from 'midi';
window.midi = midi;


import initLaunchpad from 'launchpad';
window.initLaunchpad = initLaunchpad;

import initLaunchControl from 'novation-launchcontrol';
window.initLaunchControl = initLaunchControl;


import audio from 'audio';
window.audio = audio;
window.generate = audio.generate;
window.controls = audio.controls;

var ractive = new Ractive({
    el: '#fracth-synth-1 .controls',
    template: '{{controls[0].iterations}}, {{controls[0].pattern}}',
    data: { controls }
});
