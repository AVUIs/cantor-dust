'use strict';

import player from 'player';
window.player        = player;
window.play          = player.play;
window.playDebounced = player.playDebounced;


import initLaunchpad     from 'controllers/novation-launchpad';
import initLaunchControl from 'controllers/novation-launchcontrol';
window.initLaunchpad     = initLaunchpad;
window.initLaunchControl = initLaunchControl;


import Cantor from 'canvas.cantor';
window.Cantor = Cantor;
