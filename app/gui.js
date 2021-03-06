'use strict';

import cantor from 'gui/cantor';
import state  from 'state';
import audio from 'audio';
import config from 'config';

import themes from 'gui/themes';


var canvas = document.querySelector('canvas#fractal-layer'),
    ctx    = canvas.getContext('2d'),
    scannerCanvas = document.querySelector('canvas#scanner-layer'),
    scannerCtx = scannerCanvas.getContext('2d'),
    segmentH = window.innerHeight / 8,
    STYLE = config.params.VISUALS.STYLE;


function dim(i) {
  return { x: 0, y: i * segmentH, w: window.innerWidth - 150, h: segmentH, segmentId: i };
}

function updateCantor(i, cantorArr) {
  cantor.plot(ctx, cantorArr, dim(i), STYLE);
}

function updateIterations(i, iterations) {
  var y = i * segmentH + 5,
      x = window.innerWidth - 5;
  ctx.clearRect(x - 25, y, 25, 22);
  ctx.textBaseline = 'hanging';
  ctx.textAlign    = 'right';
  ctx.fillStyle    = 'grey';
  ctx.font         = '22px monospace';
  ctx.fillText(iterations, x, y);
}

// Sorry...
function updateSliders(n, params) {
  var i = params.length,
      x = Math.ceil(window.innerWidth - 70),
      y = n * segmentH,
      w = 95,
      h = segmentH,
      sw = Math.floor(w / i),
      sh;
  //  console.log(n, i, x, y, w, h, sw);
  
  ctx.fillStyle = 'black';
  ctx.fillRect(x - w + sw, y, w, segmentH);

  ctx.fillStyle = 'grey';

  // if this is the focused generator, have it stand out a little
  if (n == state.focus)
    ctx.fillStyle = 'white';

  // Display the number of the generator on the right
  //ctx.font         = '22px monospace';
  ctx.fillText(n+1 ,x+50, y+segmentH/2);
  
  while (i--) {
    sh = 0 - (h * params[i]);
    ctx.fillRect(x + 1, y + h, sw - 1, sh);
    x -= sw;
  }
}

// http://jsfiddle.net/chicagogrooves/nRpVD/2/
var fpsInterval = 1000 / config.params.VISUALS.FPS,
    startTime = window.performance.now(),
    timeThen = startTime,
    frameCount = 0;
    //$osd = document.getElementById("osd"),


function suspendScanners(truefalse) {
  if (truefalse === true) {
    state.suspendScanners = true;
  } else {
    state.suspendScanners = false;
  }
}

function updateFrame(timeNow) {
  // request another frame
  requestAnimationFrame(updateFrame);

  var elapsed = timeNow - timeThen;

  // if enough time has elapsed, draw the next frame
  if (elapsed > fpsInterval) {

    // Get ready for next frame by setting then=now, but...
    // Also, adjust for fpsInterval not being multiple of 16.67
    timeThen = timeNow - (elapsed % fpsInterval);
    
    // draw stuff here        
    scannerCtx.fillStyle = 'white';
    
    var activeStates = state.getActiveStateIds();
    for (var i=0; i<activeStates.length; i++) {
      var stateid = activeStates[i],
	  stateI = state.load(stateid);
      if (stateI.updateIterations) {
	updateIterations(stateid, stateI.iterations);
	stateI.updateIterations = false;
      }
      if (stateI.updateCantor) {
	updateCantor(stateid, stateI.cantor);
	stateI.updateCantor = false;
      }

      if (config.params.VISUALS.drawScanLines)
	if (stateI.updateScanner !== false && !state.suspendScanners)
	  updateScanner(activeStates[i]);
    }
        
    // TESTING...Report #seconds since start and achieved fps.
    // var sinceStart = now - startTime;
    // var currentFps = Math.round(1000 / (sinceStart / ++frameCount) * 100) / 100;
    // $osd.innerHTML = "Elapsed time= " + Math.round(sinceStart / 1000 * 100) / 100 + " secs @ " + currentFps + " fps.";
    
  }
  
}

function updateScanner(i) {
  var dimI = dim(i),
      stateI = state.load(i),
      phaseI = audio.synths[i].phase;

    
  if (stateI.lastphaseOnScreen !== undefined) {
    scannerCtx.clearRect(stateI.lastphaseOnScreen-1, dimI.y-1, 2, dimI.h+2);
    stateI.lastphaseOnScreen = undefined;
  }
  else { //fallback to clearing the whole segment?
    // scannerCtx.clearRect(dimI.x, dimI.y, dimI.w, dimI.h);
  }

  
  if (phaseI !== undefined) {
    //FIXME: hacky
    stateI.numSamples = stateI.numSamples || Math.pow(stateI.pattern.length,stateI.iterations);
    
    // Faster rounding: http://www.html5rocks.com/en/tutorials/canvas/performance/#toc-avoid-float
    // var phaseOnScreen = Math.round( ((phaseI%stateI.numSamples)/stateI.numSamples) * dimI.w + dimI.x );
    var phaseOnScreen = (0.5 + ((phaseI%stateI.numSamples)/stateI.numSamples) * dimI.w + dimI.x) | 0;
    
    scannerCtx.fillRect(phaseOnScreen, dimI.y, 1, dimI.h);
    stateI.phase = phaseI;
    stateI.lastphaseOnScreen = phaseOnScreen;
  }
}
  
function updateAll() {
  var stateI,
      i = 8;
  while (i--) {
    stateI = state.load(i);
    if (stateI.cantor !== undefined) {
      updateCantor(i, stateI.cantor);
    }
    if (stateI.iterations !== undefined) {
      updateIterations(i, stateI.iterations);
    }
    
    // redraw the sliders too
    updateSliders(i,stateI.pattern);
  }
}

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight - 4;

  scannerCanvas.width = canvas.width;
  scannerCanvas.height = canvas.height;
}


function isHidden(el) {
  return (el.offsetParent === null);
}


var usageText = "";
var usageEl = document.getElementById("usage");
function toggleHelp() {

  if (isHidden(usageEl)) {
    usageEl.style.display = 'block';
    var height = window.innerHeight - 100;
    usageEl.style.height = height + "px";
  } else {
    usageEl.style.display = "none";
  }

  if (usageText === "") {
    usageEl.innerHTML = "Fetching...";

    var req = new XMLHttpRequest();
    req.addEventListener("load", function() {
      var s = req.responseText;
      if (req.status == 200)  {
        var b = s.indexOf("### Keyboard Controls");
        var e = s.indexOf("## Notes");
        usageText = s.substring(b,e).replace(/```/g,'');
        usageEl.innerHTML = "<pre>" + usageText + "</pre>";
      } else if (s.length == 0) {
        usageEl.innerHTML = 'An error occurred while fetching from <a target="blank" href="https://github.com/AVUIs/cantor-dust/#keyboard-controls">github.com/AVUIS/cantor-dust/#keyboard-controls</a>';
      }
    });

    req.open("GET", "https://raw.githubusercontent.com/AVUIs/cantor-dust/master/README.md", true);
    req.send(null);
  }
  
}

window.onresize = resizeCanvas;
resizeCanvas();

updateFrame();

export default { updateCantor, updateIterations, updateSliders, suspendScanners, updateAll, toggleHelp, STYLE};
