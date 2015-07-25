'use strict';

var midiAccess;

navigator.requestMIDIAccess().then(
  (e) => { midiAccess = e; },
  ( ) => { console.log('Failed to get midi access.'); }
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

// Returns an array of names of available midi inputs
//
function availableDevices() {
  var inputs = midiAccess.inputs.values(),
      result = inputs.next(),
      names  = [];
  while (!result.done) {
    names.push(result.value.name);
    result = inputs.next();
  }
  return names;
}

export default { getDevice, availableDevices };
