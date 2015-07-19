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

import Cantor from 'canvas.cantor';
window.Cantor = Cantor;


// var synth0 = new Bind({
//     iterations: window.controls[0]
// }, {
    
// });


// var ractive = new Ractive({
//     el: '#fract-synth-1 .controls',
//     template: '{{iterations}}, {{pattern}}',
//     data: controls[0] 
// });
