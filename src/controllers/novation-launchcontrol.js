'use strict';

import midi from 'midi';


var launchControl = {};

function initLaunchControl() {
  midi.getDevice(
    function(inp, out)  {
      inp.onmidimessage = printMidiMessage;
      launchControl = { input: inp, output: out };
    },
    /^Launch Control/
  );
}


function printMidiMessage(e) {
  console.log('Got MIDI:', e.data);
}

export default initLaunchControl;
