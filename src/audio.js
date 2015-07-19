'use strict';

var audioCtxConstructor = (window.AudioContext || window.webkitAudioContext),
    audioCtx = new audioCtxConstructor(),
    nSamples = Math.pow(2, 19),
    sources  = [],
    buffers  = [],
    jsNodes = [],
    analysers = [],
    controls = [],
    fractal  = [0],
    nsynths = 8;


(function() {
    var source, buffer, left, right;
    var i = nsynths;
  while (i--) {
    source = audioCtx.createBufferSource();
    buffer = audioCtx.createBuffer(2, nSamples, audioCtx.sampleRate);
    left   = buffer.getChannelData(0);
    right  = buffer.getChannelData(1);
    buffers[i] = [left, right];
    source.loop   = true;
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start();

    sources[i] = source;  
      
    controls[i] = {iterations: 0, pattern: []};
  }
}());


function generate(i, pattern, iterations) {
  var worker = new Worker('worker/fractal.js');
  worker.onmessage = function(e) {
    console.log('Fractal generated');
    load(i, e.data);
  };
    controls[i].pattern = pattern;
    controls[i].iterations = iterations;
  worker.postMessage([pattern, iterations]);
}

function load(num, frames) {
  var [left, right] = buffers[num],
      framesLen = frames.length,
      len, i;
  for (i = 0, len = left.length; i < len; i++) {
    left[i]  = frames[i % framesLen];
    right[i] = frames[i % framesLen];
  }
}



// http://www.smartjava.org/content/exploring-html5-web-audio-visualizing-sound

(function setupAudioNodes() {

    for (var i=0; i<nsynths; i++) {
	// setup a javascript node
	var javascriptNode = audioCtx.createScriptProcessor(2048, 1, 1);
	// connect to destination, else it isn't called
	javascriptNode.connect(audioCtx.destination);

	jsNodes[i] = javascriptNode;

	
	// setup an analyzer
	var analyser = audioCtx.createAnalyser();
	analyser.smoothingTimeConstant = 0.3;
	analyser.fftSize = 512;

	analysers[i] = analyser;

	sources[i].connect(analysers[i]);
	analysers[i].connect(jsNodes[i]);

	var canvasid = "#c"+i;
	var canvas = document.querySelector(canvasid);
	var ctx = canvas.getContext("2d");
	
	(function(ctx, analyser) {
	    javascriptNode.onaudioprocess = function() {

	   
		// get the average for the first channel
		var array =  new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(array);
		
		// clear the current state
		ctx.clearRect(0, 0, 1000, 325);
		
		// set the fill style
		ctx.fillStyle = "#FF0000";
		drawSpectrum(array,ctx);

	    }
	})(ctx, analyser);
	
    }
    
})();


function drawSpectrum(array,ctx) {
    for ( var i = 0; i < (array.length); i++ ){
        var value = array[i];
        ctx.fillRect(i*5,325-value,3,325);
    }
};


export default { generate, controls };
