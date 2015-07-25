'use strict';

import player from 'player';
window.player        = player;
window.play          = player.play;
window.playDebounced = player.playDebounced;


import initLaunchpad     from 'controllers/launchpad';
import initLaunchControl from 'controllers/novation-launchcontrol';
import initCMDLC1        from 'controllers/cmd-lc1';
window.initLaunchpad     = initLaunchpad;
window.initLaunchControl = initLaunchControl;
window.initCMDLC1        = initCMDLC1;


import { availableDevices } from 'midi';
window.availableDevices = availableDevices;
