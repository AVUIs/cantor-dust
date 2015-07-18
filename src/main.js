'use strict';

var worker = new Worker('worker/fractal.js');
worker.onmessage = function(e) {
    play(e.data);
};

window.worker = worker;

// modified from http://mdn.github.io/audio-buffer/
var contextConstructor = (window.AudioContext || window.webkitAudioContext);
var audioCtx = new contextConstructor();

function play(raw_data) {

    var data_length = raw_data.length;

    // Stereo
    var channels = 2;
    // Create an empty two second stereo buffer at the
    // sample rate of the AudioContext
    var frameCount = audioCtx.sampleRate * 20.0;

    var myArrayBuffer = audioCtx.createBuffer(channels, frameCount, audioCtx.sampleRate);

    for (var channel = 0; channel < channels; channel++) {
	// This gives us the actual array that contains the data
	var nowBuffering = myArrayBuffer.getChannelData(channel);
	for (var i = 0; i < frameCount; i++) {
	    // Math.random() is in [0; 1.0]
	    // audio needs to be in [-1.0; 1.0]
	    nowBuffering[i] = raw_data[i % data_length];
	}
    }

    // Get an AudioBufferSourceNode.
    // This is the AudioNode to use when we want to play an AudioBuffer
    var source = audioCtx.createBufferSource();
    // set the buffer in the AudioBufferSourceNode
    source.buffer = myArrayBuffer;
    // connect the AudioBufferSourceNode to the
    // destination so we can hear the sound
    source.connect(audioCtx.destination);
    // start the source playing
    source.start();
}
window.play = play;
