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
  midi.getDevice(registerLaunchpad, /^Launchpad/);
}

function registerLaunchpad(input, output) {
  if (input && output) {
    input.onmidimessage = recieveMIDIMessage;
    launchpad = { input, output };
  } else {
    throw 'ERROR: Launchpad MIDI device not found';
  }
}

function isSideButton(note) {
  return !(note <= 104 || note >= 111);
}
function isTopButton(note) {
  return (
    note === 8   ||
    note === 24  ||
    note === 40  ||
    note === 56  ||
    note === 72  ||
    note === 88  ||
    note === 104 ||
    note === 120
  );
}
function isGrid(note) {
  return !(isTopButton(note) || isSideButton(note));
}

function lightOn(note) {
  launchpad.output.send([144, note, 63]);
}
function lightOff(note) {
  launchpad.output.send([144, note, 12]);
}
function lightFlash(note, duration) {
  lightOn(note);
  setTimeout(() => { lightOff(note); }, duration || 500);
}
function lightColumn(col, num) {
  var colOffset = gridToMidiNote(col, 0),
      i = num + 1;
  lightColumnOff(col);
  while (i--) { lightOn(colOffset + i); }
}
function lightColumnOff(col) {
  var colOffset = gridToMidiNote(col, 0),
      i = 8;
  while (i--) { lightOff(colOffset + i); }
}


// Grid starts bottom left
function midiNoteToGrid(note) {
  var x = Math.floor(note / 16),
      y = note % 16;
  return [x, y];
}
function gridToMidiNote(x, y) {
  return x * 16 + y;
}


function recieveMIDIMessage(e) {
  var note = e.data[1],
      x,
      y;
  if (isGrid(note)) {
    [x, y] = midiNoteToGrid(note);
    lightColumn(x, y);
  }
}

export default initLaunchpad;
