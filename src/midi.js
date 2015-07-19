'use strict';

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

navigator.requestMIDIAccess().then(
  e => { setupLaunchpad(e); },
  _ => { console.log('Failed to get midi access.'); }
);

function setupLaunchpad(midi) {
  var inputs  = midi.inputs.values(),
      outputs = midi.outputs.values(),
      lpIn    = findLaunchpad(inputs),
      lpOut   = findLaunchpad(outputs);
  lpIn.onmidimessage = printMidiMessage;
  launchpad.input  = lpIn;
  launchpad.output = lpOut;
}

function findLaunchpad(devices) {
  var result = { done: false };
  while (!result.done) {
    result = devices.next();
    if (/^Launchpad/.test(result.value.name)) { return result.value; }
  }
}

function printMidiMessage(e) {
  var cell = midiNoteToGrid(e.data[1]);
  launchpad.output.send([144, e.data[1], 63]);
  setTimeout(() => { launchpad.output.send([144, e.data[1], 12]); }, 500);
  console.log('Got MIDI:', cell);
}

// Grid starts bottom left
function midiNoteToGrid(note) {
  var x = Math.floor(note / 16),
      y = note % 16;
  return [x, y];
}

export default { launchpad: () => launchpad };
