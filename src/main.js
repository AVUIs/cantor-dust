'use strict';

var worker = new Worker('worker/fractal.js');
window.worker = worker;
