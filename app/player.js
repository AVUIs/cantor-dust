'use strict';

import audio from 'audio';

var debouncedTimeouts = [],
    workers = [];

function terminate(i) {
  if (workers[i] && workers[i].terminate) {
    workers[i].terminate();
  }
}

function update(i, data) {
  var cantor = data[data.length - 1];
  audio.synths[i].wavetable = cantor;
}

function resetWorker(i) {
  terminate(i);
  workers[i] = new Worker('worker/cantor.js');
  workers[i].onmessage = (e) => {
    update(i, e.data);
    console.log('Fractal generated');
  };
}

function play(i, pattern, iterations) {
  resetWorker(i);
  workers[i].postMessage([pattern, iterations]);
}

function playDebounced(i, pattern, iterations, timeout = 250) {
  clearTimeout(debouncedTimeouts[i]);
  debouncedTimeouts[i] = setTimeout(
    () => play(i, pattern, iterations),
    timeout
  );
}

export default { play, playDebounced };
