'use strict';

var midiAccess;

navigator.requestMIDIAccess().then(
  e => { midiAccess = e; },
  _ => { console.log('Failed to get midi access.'); }
);

function findDevice(devices, nameRegex) {
  var result = devices.next();
  while (!result.done) {
    if (nameRegex.test(result.value.name)) { return result.value; }
    result = devices.next();
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

export default { getDevice };
