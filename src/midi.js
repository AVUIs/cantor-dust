'use strict';

var midiAccess;

var midicontroller = {},
    // TODO: remove
    launchpad = midicontroller;

navigator.requestMIDIAccess().then(
  e => { midiAccess = e; },
  _ => { console.log('Failed to get midi access.'); }
);

function findDevice(devices, nameRegex) {
  var result = { done: false };
  while (!result.done) {
    result = devices.next();
    if (nameRegex.test(result.value.name)) { return result.value; }
  }
}

// Callback gets the input and output as arguments
// Name should be a regex
//
function getDevice(cb, nameRegex) {
  var inputs  = midiAccess.inputs.values(),
      outputs = midiAccess.outputs.values(),
      input   = findDevice(inputs, nameRegex),
      output  = findDevice(outputs, nameRegex);
  cb(input, output);
}

export default { getDevice, initMidiController };



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

//var launchpad = {};

function initMidiController() {
  getDevice(
    function(inp, out)  {
      inp.onmidimessage = printMidiMessage;
      midicontroller = { input: inp, output: out };
    },
    /^Launch(pad| Control)/
  );
}




// Grid starts bottom left
function midiNoteToGrid(note) {
  var x = Math.floor(note / 16),
      y = note % 16;
  return [x, y];
}

function printMidiMessage(e) {
  // var cell = midiNoteToGrid(e.data[1]);
  // launchpad.output.send([144, e.data[1], 63]);
  // setTimeout(() => { launchpad.output.send([144, e.data[1], 12]); }, 500);
  console.log('Got MIDI:', e.data);
}
