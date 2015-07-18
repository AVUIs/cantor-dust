'use strict';

var callback = (e) => { console.log(e); },
    worker = new Worker('worker/fractal.js');

worker.onmessage = (message) => {
  callback(message.data);
};

function calculate(pattern, cb) {
  pattern  = pattern || [1, 0.5, 1];
  callback = cb || callback;
  worker.postMessage(pattern);
}

export default { calculate };
