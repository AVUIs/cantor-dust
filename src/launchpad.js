'use strict';

import midi from 'midi';

// Use the launchpad rotated 90 degrees anticlockwise

// Decimal Colour Brightness
// 12      Off    Off
// 13      Red    Low
// 15      Red    Full
// 29      Amber  Low
// 63      Amber  Full
// 62      Yellow Full
// 28      Green  Low
// 60      Green  Full 

var launchpad = {};

function initLaunchpad() {
  midi.getDevice(
    function(inp, out)  {
      inp.onmidimessage = printMidiMessage;
      launchpad = { input: inp, output: out };
    },
    /^Launchpad/
  );
}

// Grid starts bottom left
function midiNoteToGrid(note) {
  var x = Math.floor(note / 16),
      y = note % 16;
  return [x, y];
}

function printMidiMessage(e) {
  var cell = midiNoteToGrid(e.data[1]);
  launchpad.output.send([144, e.data[1], 63]);
  setTimeout(() => { launchpad.output.send([144, e.data[1], 12]); }, 500);
  console.log('Got MIDI:', cell);
}

export default initLaunchpad;
