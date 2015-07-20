'use strict';

import midi from 'midi';
window.midi = midi;

import player from 'player';
window.play          = player.play;
window.playDebounced = player.playDebounced;

import initLaunchpad     from 'controllers/novation-launchpad';
import initLaunchControl from 'controllers/novation-launchcontrol';
window.initLaunchpad     = initLaunchpad;
window.initLaunchControl = initLaunchControl;


import audio from 'audio';
window.audio = audio;
window.generate = audio.generate;

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
