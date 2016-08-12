(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var _cmp = 'components/';
  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf(_cmp) === 0) {
        start = _cmp.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return _cmp + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var _reg = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (_reg.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  require._cache = cache;
  globals.require = require;
})();
require.register("audio", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _nativeAudio = require('native-audio');

// import {synths,numSamples} from 'gibberish-audio';
// import {synths,numSamples} from 'new-audio';

var _state = require('state');

var _state2 = _interopRequireDefault(_state);

function loadSynthParamsFromState() {
  var ids = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
  var params = arguments.length <= 1 || arguments[1] === undefined ? ["amp", "pitch", "phase"] : arguments[1];

  ids.map(function (id) {
    var stateI = _state2['default'].load(id),
        synthI = _nativeAudio.synths[id];

    params.forEach(function (param, i) {
      if (stateI[param]) synthI[param] = stateI[param];
    });
  });
}

function synth(i, fn) {
  return fn(_nativeAudio.synths[i]);
}

function focusedSynth(fn) {
  return fn(_nativeAudio.synths[_state2['default'].focus]);
}

function allSynths(fn) {
  return _nativeAudio.synths.map(function (s, i) {
    return fn(s);
  });
}

function allSynthsButFocused(fn) {
  return _nativeAudio.synths.map(function (s, i) {
    if (s.id != _state2['default'].focus) fn(s);
  });
}

exports['default'] = { synths: _nativeAudio.synths, numSamples: _nativeAudio.numSamples, loadSynthParamsFromState: loadSynthParamsFromState, focusedSynth: focusedSynth, allSynths: allSynths, allSynthsButFocused: allSynthsButFocused };
module.exports = exports['default'];
});

require.register("config", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var params = {
  VISUALS: {
    STYLE: {
      withColours: true,
      invertColours: false,
      drawAllLevels: true,
      drawLevelsTopDown: false
    },
    drawScanLines: true,
    FPS: 40
  },

  AUDIO: {
    resetPhaseOnNewBuffer: false
  }
};

var original = {
  VISUALS: {
    STYLE: {
      withColours: false,
      invertColours: false,
      drawAllLevels: true,
      drawLevelsTopDown: true
    },
    drawScanLines: false,
    FPS: 60
  },

  AUDIO: {
    resetPhaseOnNewBuffer: true
  }
};

exports['default'] = { params: params };
module.exports = exports['default'];
});

require.register("controllers/cmd-lc1", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _midi = require('midi');

var _midi2 = _interopRequireDefault(_midi);

var _controllersCmdLc1Message = require('controllers/cmd-lc1/message');

var _controllersCmdLc1Message2 = _interopRequireDefault(_controllersCmdLc1Message);

var _controllersCmdLc1Controls = require('controllers/cmd-lc1/controls');

var _controllersCmdLc1Controls2 = _interopRequireDefault(_controllersCmdLc1Controls);

var _controllersCmdLc1Lights = require('controllers/cmd-lc1/lights');

var _controllersCmdLc1Lights2 = _interopRequireDefault(_controllersCmdLc1Lights);

var _player = require('player');

var _player2 = _interopRequireDefault(_player);

var _state = require('state');

var _state2 = _interopRequireDefault(_state);

var _gui = require('gui');

var _gui2 = _interopRequireDefault(_gui);

var lc;

function handleEncoder(msg) {
  var val = _controllersCmdLc1Message2['default'].fromEncoder(msg);

  var _controls$adjustPattern = _controllersCmdLc1Controls2['default'].adjustPattern(val);

  var _controls$adjustPattern2 = _slicedToArray(_controls$adjustPattern, 2);

  var i = _controls$adjustPattern2[0];
  var pat = _controls$adjustPattern2[1];

  _controllersCmdLc1Lights2['default'].forPattern(lc, pat);
  _gui2['default'].updateSliders(i, pat);
}

function handleIterationMessage(msg) {
  var itr = msg[1] - 31;
  _controllersCmdLc1Controls2['default'].setIterations(itr);
  _controllersCmdLc1Lights2['default'].forIterations(lc, itr);
}

function handleQuietenMessage(msg) {
  var i = msg[1] - 48,
      st = _state2['default'].load(i),
      pat = st.pattern.map(function (e) {
    return e * 0.95;
  });
  st.pattern = pat;
  _state2['default'].save(i, st);
  _player2['default'].playDebounced(i, st.pattern, st.iterations, 150);
  _controllersCmdLc1Lights2['default'].forPattern(lc, pat);
  _gui2['default'].updateSliders(i, pat);
}

function handleFocusChange(msg) {
  var num = _controllersCmdLc1Message2['default'].fromNumber(msg),
      sta = _state2['default'].load(num),
      pat = sta.pattern,
      itr = sta.iterations;
  _controllersCmdLc1Controls2['default'].setFocus(num);
  _controllersCmdLc1Lights2['default'].forFocus(lc, num);
  _controllersCmdLc1Lights2['default'].forIterations(lc, itr);
  _controllersCmdLc1Lights2['default'].forPattern(lc, pat);
}

function recieveMIDIMessage(e) {
  var msg = e.data;
  if (_controllersCmdLc1Message2['default'].isEncoder(msg)) {
    handleEncoder(msg);
  } else if (_controllersCmdLc1Message2['default'].isNumberOn(msg)) {
    handleFocusChange(msg);
  } else if (_controllersCmdLc1Message2['default'].isGridOn(msg)) {
    if (msg[1] < 48) {
      handleIterationMessage(msg);
    } else {
      handleQuietenMessage(msg);
    }
  }
}

function registerCMDLC1(input, output) {
  if (input && output) {
    input.onmidimessage = recieveMIDIMessage;
    lc = { input: input, output: output };
    _controllersCmdLc1Lights2['default'].forIterations(lc, 8);
    _controllersCmdLc1Lights2['default'].forFocus(lc, 0);
  } else {
    throw 'ERROR: Launchpad MIDI device not found';
  }
}

function initCMDLC1() {
  _midi2['default'].getDevice(registerCMDLC1, /^CMD LC-1$/);
  _controllersCmdLc1Controls2['default'].init();
}

exports['default'] = initCMDLC1;
module.exports = exports['default'];
});

require.register("controllers/cmd-lc1/controls", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _player = require('player');

var _player2 = _interopRequireDefault(_player);

var _state = require('state');

var _state2 = _interopRequireDefault(_state);

var _gui = require('gui');

var _gui2 = _interopRequireDefault(_gui);

var MAXITERATIONS = 8;
var MINITERATIONS = 1;

var focused = 0,
    stepSize = 0.03,
    controls = [];

function save(i, data) {
  controls[i] = data;
}

function load(i) {
  return controls[i];
}

function init() {
  var i = 8;

  // initialise the default focus first
  controls[focused] = _state2['default'].load(focused);
  setFocus(focused);

  while (i--) {
    controls[i] = _state2['default'].load(i);setFocus(i);
  }
}

function setFocus(i) {
  //  console.log(`Focused ${i}`);

  var oldfocus = focused;

  focused = i;
  _state2['default'].focus = focused;

  // console.log(oldfocus, controls[oldfocus].pattern);
  // console.log(focused,controls[focused].pattern);

  _gui2['default'].updateSliders(oldfocus, controls[oldfocus].pattern);
  _gui2['default'].updateSliders(focused, controls[focused].pattern);
}

// Takes an encoder object { encoder: index, change: (1|-1) }
// and increments or decrements the matching pattern segment
//
function adjustPattern(msg) {
  var ctr = controls[focused],
      pattern = ctr.pattern,
      val;
  if (pattern[msg.encoder] !== undefined) {
    val = pattern[msg.encoder] + stepSize * msg.change;
    val = Math.min(1, val);
    val = Math.max(0, val);
    pattern[msg.encoder] = val;
  }
  _player2['default'].playDebounced(focused, ctr.pattern, ctr.iterations, 200);

  return [focused, pattern];
}

function restartFocused() {
  adjustPattern({ encoder: focused, change: 0 });
}

function invertFocusedPattern() {
  var ctr = controls[focused],
      pattern = ctr.pattern;

  ctr.pattern = pattern.map(function (v) {
    return 1.0 - v;
  });
  _state2['default'].load(focused).pattern = pattern;

  _gui2['default'].updateSliders(focused, ctr.pattern);
  restartFocused();
}

function resetFocusedPattern() {
  var ctr = controls[focused],
      pattern = ctr.pattern;

  ctr.pattern = [0.5, 0.5, 0.5, 0.5];
  _state2['default'].load(focused).pattern = pattern;

  _gui2['default'].updateSliders(focused, ctr.pattern);
  restartFocused();
}

function setIterations(itr, isdelta) {
  var s = _state2['default'].load(focused);
  s.iterations = isdelta ? s.iterations + itr : itr;
  if (s.iterations > MAXITERATIONS) s.iterations = MAXITERATIONS;
  if (s.iterations < MINITERATIONS) s.iterations = MINITERATIONS;
  //FIXME: hacky
  s.numSamples = Math.pow(s.pattern.length, s.iterations);
  _state2['default'].save(focused, s);
  controls[focused].iterations = s.iterations;
  _gui2['default'].updateIterations(focused, s.iterations);
}

exports['default'] = { init: init, load: load, save: save, setFocus: setFocus, adjustPattern: adjustPattern, resetFocusedPattern: resetFocusedPattern, invertFocusedPattern: invertFocusedPattern, restartFocused: restartFocused, setIterations: setIterations };
module.exports = exports['default'];
});

require.register("controllers/cmd-lc1/lights", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _controllersCmdLc1Message = require('controllers/cmd-lc1/message');

var _controllersCmdLc1Message2 = _interopRequireDefault(_controllersCmdLc1Message);

function on(lc, note) {
  lc.output.send([144, note, 3]);
}
function off(lc, note) {
  lc.output.send([144, note, 127]);
}

function numBlue(lc, note) {
  lc.output.send([144, note, 1]);
}
function numOrange(lc, note) {
  lc.output.send([144, note, 0]);
}

function forIterations(lc, itr) {
  var i = 16;
  while (i--) {
    off(lc, i + 32);
  }
  while (itr--) {
    on(lc, itr + 32);
  }
}

function forFocus(lc, n) {
  var i = 8;
  while (i--) {
    numOrange(lc, i + 16);
  }
  numBlue(lc, _controllersCmdLc1Message2['default'].toNumber(n));
}

function forPattern(lc, pattern) {
  var i = 8,
      val,
      numLights;
  while (i--) {
    val = pattern[i];
    if (val !== undefined) {
      numLights = Math.ceil(15 * val);
      lc.output.send([176, i + 16, numLights]);
    }
  }
  window.f = function (x, y, z) {
    lc.output.send([x, y, z]);
  };
}

exports['default'] = { forIterations: forIterations, forFocus: forFocus, forPattern: forPattern };
module.exports = exports['default'];
});

require.register("controllers/cmd-lc1/message", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function isOn(msg) {
  return msg[0] === 144 && msg[2] === 127;
}

function isEncoder(msg) {
  var x = msg[0],
      y = msg[1];
  return x === 176 && (y >= 16 || y <= 23);
}

function fromEncoder(msg) {
  var encoder = msg[1] - 16,
      change = msg[2] - 64;
  return { encoder: encoder, change: change };
}

function isNumberOn(msg) {
  var y = msg[1];
  return isOn(msg) && y >= 16 && y <= 23;
}

function fromNumber(msg) {
  return msg[1] - 16;
}

function toNumber(n) {
  return n + 16;
}

function isRecOn(msg) {
  var y = msg[1];
  return isOn(msg) && y >= 72 && y <= 75;
}

function fromRecOn(msg) {
  return msg[1] - 16;
}

function isGridOn(msg) {
  var y = msg[1];
  return isOn(msg) && y >= 32 && y <= 63;
}

function gridNoteFromXY(_ref) {
  var _ref2 = _slicedToArray(_ref, 2);

  var x = _ref2[0];
  var y = _ref2[1];

  y = Math.abs((y - 15) * 4);
  return y + x;
}
function fromGrid(msg) {
  var a = msg[1],
      x = a % 4,
      y = Math.abs(Math.floor(a / 4) - 15);
  return [x, y];
}

exports['default'] = {
  isEncoder: isEncoder, fromEncoder: fromEncoder,
  isNumberOn: isNumberOn, fromNumber: fromNumber, toNumber: toNumber,
  isRecOn: isRecOn, fromRecOn: fromRecOn,
  isGridOn: isGridOn, fromGrid: fromGrid,
  gridNoteFromXY: gridNoteFromXY
};
module.exports = exports['default'];
});

require.register("controllers/keyboard", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _controllersCmdLc1Controls = require('controllers/cmd-lc1/controls');

var _controllersCmdLc1Controls2 = _interopRequireDefault(_controllersCmdLc1Controls);

var _gui = require('gui');

var _gui2 = _interopRequireDefault(_gui);

var _state = require('state');

var _state2 = _interopRequireDefault(_state);

var _player = require('player');

var _player2 = _interopRequireDefault(_player);

var _audio = require('audio');

var _audio2 = _interopRequireDefault(_audio);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _guiThemes = require('gui/themes');

var _guiThemes2 = _interopRequireDefault(_guiThemes);

function initKeyboard() {

  _controllersCmdLc1Controls2['default'].init();

  // Focus on a generator
  key('1', function () {
    return _controllersCmdLc1Controls2['default'].setFocus(0);
  });
  key('2', function () {
    return _controllersCmdLc1Controls2['default'].setFocus(1);
  });
  key('3', function () {
    return _controllersCmdLc1Controls2['default'].setFocus(2);
  });
  key('4', function () {
    return _controllersCmdLc1Controls2['default'].setFocus(3);
  });
  key('5', function () {
    return _controllersCmdLc1Controls2['default'].setFocus(4);
  });
  key('6', function () {
    return _controllersCmdLc1Controls2['default'].setFocus(5);
  });
  key('7', function () {
    return _controllersCmdLc1Controls2['default'].setFocus(6);
  });
  key('8', function () {
    return _controllersCmdLc1Controls2['default'].setFocus(7);
  });

  // or move the focus with the arrow keys 
  key('up', function () {
    return _controllersCmdLc1Controls2['default'].setFocus((_state2['default'].focus - 1 + 8) % 8);
  });
  key('down', function () {
    return _controllersCmdLc1Controls2['default'].setFocus((_state2['default'].focus + 1) % 8);
  });

  // let's have vi keys for this as well
  key('k', function () {
    return _controllersCmdLc1Controls2['default'].setFocus((_state2['default'].focus - 1 + 8) % 8);
  });
  key('j', function () {
    return _controllersCmdLc1Controls2['default'].setFocus((_state2['default'].focus + 1) % 8);
  });

  // increase/decrease the first slider
  key('q', function () {
    return adjustPatternAndUpdateSliders(0, 1);
  });
  key('a', function () {
    return adjustPatternAndUpdateSliders(0, -1);
  });

  // increase/decrease the second slider
  key('w', function () {
    return adjustPatternAndUpdateSliders(1, 1);
  });
  key('s', function () {
    return adjustPatternAndUpdateSliders(1, -1);
  });

  // increase/decrease the third slider
  key('e', function () {
    return adjustPatternAndUpdateSliders(2, 1);
  });
  key('d', function () {
    return adjustPatternAndUpdateSliders(2, -1);
  });

  // increase/decrease the forth slider
  key('r', function () {
    return adjustPatternAndUpdateSliders(3, 1);
  });
  key('f', function () {
    return adjustPatternAndUpdateSliders(3, -1);
  });

  // increase/decrease the fifth slider
  key('t', function () {
    return adjustPatternAndUpdateSliders(4, 1);
  });
  key('g', function () {
    return adjustPatternAndUpdateSliders(4, -1);
  });

  // copy the state & sliders of the focused generator
  key('c', function () {
    return _state2['default'].copytobuffer(_state2['default'].focus);
  });

  // paste the copied state & slider settings into the newly focused generator
  key('v', function () {
    var saved = _state2['default'].savefrombuffer(_state2['default'].focus);
    if (!saved) return;
    _controllersCmdLc1Controls2['default'].save(_state2['default'].focus, saved);
    _audio2['default'].loadSynthParamsFromState([_state2['default'].focus]);
    adjustPatternAndUpdateSliders(_state2['default'].focus, /*force-redraw*/0);
  });

  key('x', function () {
    return _controllersCmdLc1Controls2['default'].resetFocusedPattern();
  });

  key('i', function () {
    return _controllersCmdLc1Controls2['default'].invertFocusedPattern();
  });

  key('[', function () {
    _controllersCmdLc1Controls2['default'].setIterations(-1, /*isdelta*/true);_controllersCmdLc1Controls2['default'].restartFocused();
  });
  key(']', function () {
    _controllersCmdLc1Controls2['default'].setIterations(1, /*isdelta*/true);_controllersCmdLc1Controls2['default'].restartFocused();
  });

  /* VOLUME */

  // control the volume of the focused generator
  key('-', function () {
    return _player2['default'].volume(_state2['default'].focus, -0.1, true);
  });
  key('=', function () {
    return _player2['default'].volume(_state2['default'].focus, 0.1, true);
  });
  key('0', function () {
    return _player2['default'].togglemute(_state2['default'].focus);
  });

  // control the volume of all but the focused generator
  key('alt+-', function () {
    return _audio2['default'].allSynthsButFocused(function (s) {
      _player2['default'].volume(s.id, -0.1, true);
    });
  });
  key('alt+=', function () {
    return _audio2['default'].allSynthsButFocused(function (s) {
      _player2['default'].volume(s.id, 0.1, true);
    });
  });
  key('alt+0', function () {
    return _audio2['default'].allSynthsButFocused(function (s) {
      _player2['default'].togglemute(s.id);
    });
  });

  // control the volume of all generators
  key('shift+-', function () {
    return _audio2['default'].allSynths(function (s) {
      _player2['default'].volume(s.id, -0.1, true);
    });
  });
  key('shift+=', function () {
    return _audio2['default'].allSynths(function (s) {
      _player2['default'].volume(s.id, 0.1, true);
    });
  });
  key('shift+0', function () {
    return _audio2['default'].allSynths(function (s) {
      _player2['default'].togglemute(s.id);
    });
  });

  /* PITCH (PLAYRATE) */

  var PLAYRATE_UP_FACTOR = Math.sqrt(2),
      PLAYRATE_DOWN_FACTOR = 1 / PLAYRATE_UP_FACTOR;

  // control the pitch (playrate) of the focused generator
  key(',', function () {
    return _audio2['default'].focusedSynth(function (s) {
      s.pitch *= PLAYRATE_DOWN_FACTOR;
    });
  });
  key('.', function () {
    return _audio2['default'].focusedSynth(function (s) {
      s.pitch *= PLAYRATE_UP_FACTOR;
    });
  });
  key('m', function () {
    return _audio2['default'].focusedSynth(function (s) {
      s.pitch = 1 / 8;
    });
  });

  // control the pitch (playrate) of all but the focused generator
  key('alt+,', function () {
    return _audio2['default'].allSynthsButFocused(function (s) {
      s.playRatechange(PLAYRATE_DOWN_FACTOR);
    });
  });
  key('alt+.', function () {
    return _audio2['default'].allSynthsButFocused(function (s) {
      s.playRatechange(PLAYRATE_UP_FACTOR);
    });
  });
  key('alt+m', function () {
    return _audio2['default'].allSynthsButFocused(function (s) {
      s.pitch = 1 / 8;
    });
  });

  // control the pitch (playrate) of all generators
  key('shift+,', function () {
    return _audio2['default'].allSynths(function (s) {
      s.playRatechange(PLAYRATE_DOWN_FACTOR);
    });
  });
  key('shift+.', function () {
    return _audio2['default'].allSynths(function (s) {
      s.playRatechange(PLAYRATE_UP_FACTOR);
    });
  });
  key('shift+m', function () {
    return _audio2['default'].allSynths(function (s) {
      s.pitch = 1 / 8;
    });
  });

  /* PHASE */

  // control the phase of the focused generator
  key('p', function () {
    return _audio2['default'].focusedSynth(function (s) {
      s.phase = 0;
    });
  });

  // control the phase of all but the focused generator
  key('alt+p', function () {
    return _audio2['default'].allSynthsButFocused(function (s) {
      s.phase = 0;
    });
  });

  // control the phase of all generators
  key('shift+p', function () {
    return _audio2['default'].allSynths(function (s) {
      s.phase = 0;
    });
  });

  /* MISC */

  key('shift+s', function () {
    return _state2['default'].saveToURL();
  }); // state -> url

  key('l', function () {
    var focused = _state2['default'].load(_state2['default'].focus);focused.updateScanner = !focused.updateScanner;
  });
  key('shift+l', function () {
    _gui2['default'].suspendScanners(!_state2['default'].suspendScanners);
  });

  key('shift+\\', function () {
    _guiThemes2['default'].currentPalette = _guiThemes2['default'].nextPalette();document.title = "Cantor Dust :: " + _guiThemes2['default'].currentPalette.name;_gui2['default'].updateAll();
  });

  // shift+/ := ?
  key('shift+/', function () {
    _gui2['default'].toggleHelp();
  });
}

function adjustPatternAndUpdateSliders(index, change) {
  var _controls$adjustPattern = _controllersCmdLc1Controls2['default'].adjustPattern({ encoder: index, change: change });

  var _controls$adjustPattern2 = _slicedToArray(_controls$adjustPattern, 2);

  var focused = _controls$adjustPattern2[0];
  var pattern = _controls$adjustPattern2[1];

  _gui2['default'].updateSliders(focused, pattern);
  return [focused, pattern];
}

exports['default'] = initKeyboard;
module.exports = exports['default'];
});

require.register("controllers/launchpad", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _midi = require('midi');

var _midi2 = _interopRequireDefault(_midi);

var _controllersLaunchpadLights = require('controllers/launchpad/lights');

var _controllersLaunchpadLights2 = _interopRequireDefault(_controllersLaunchpadLights);

var _controllersLaunchpadGrid = require('controllers/launchpad/grid');

var _controllersLaunchpadGrid2 = _interopRequireDefault(_controllersLaunchpadGrid);

// Use the launchpad rotated 90 degrees anticlockwise

var lp = {};

function recieveMIDIMessage(e) {
  var msg = e.data,
      note = msg[1];
  if (note.isOnMessage(msg) && note.isGrid(note)) {
    var _grid$fromNote = _controllersLaunchpadGrid2['default'].fromNote(note);

    var _grid$fromNote2 = _slicedToArray(_grid$fromNote, 2);

    var x = _grid$fromNote2[0];
    var y = _grid$fromNote2[1];

    _controllersLaunchpadLights2['default'].columnOn(lp, x, y);
  }
}

function registerLaunchpad(input, output) {
  if (input && output) {
    input.onmidimessage = recieveMIDIMessage;
    lp = { input: input, output: output };
    _controllersLaunchpadLights2['default'].gridOff(lp);
  } else {
    throw 'ERROR: Launchpad MIDI device not found';
  }
}

function initLaunchpad() {
  _midi2['default'].getDevice(registerLaunchpad, /^Launchpad/);
}

exports['default'] = initLaunchpad;
module.exports = exports['default'];
});

require.register("controllers/launchpad/grid", function(exports, require, module) {
'use strict';

// Grid starts bottom left

Object.defineProperty(exports, '__esModule', {
  value: true
});
function fromNote(note) {
  var x = Math.floor(note / 16),
      y = note % 16;
  return [x, y];
}
function toNote(x, y) {
  return x * 16 + y;
}

exports['default'] = { fromNote: fromNote, toNote: toNote };
module.exports = exports['default'];
});

require.register("controllers/launchpad/lights", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _controllersLaunchpadGrid = require('controllers/launchpad/grid');

var _controllersLaunchpadGrid2 = _interopRequireDefault(_controllersLaunchpadGrid);

// Decimal Colour Brightness
// 12      Off    Off
// 13      Red    Low
// 15      Red    Full
// 29      Amber  Low
// 63      Amber  Full
// 62      Yellow Full
// 28      Green  Low
// 60      Green  Full

function on(lp, note) {
  lp.output.send([144, note, 63]);
}
function off(lp, note) {
  lp.output.send([144, note, 12]);
}

function flash(lp, note) {
  var duration = arguments.length <= 2 || arguments[2] === undefined ? 500 : arguments[2];

  on(lp, note);
  setTimeout(function () {
    off(lp, note);
  }, duration);
}

function columnOff(lp, col) {
  var colOffset = _controllersLaunchpadGrid2['default'].toNote(col, 0),
      i = 8;
  while (i--) {
    off(lp, colOffset + i);
  }
}

function columnOn(lp, col, num) {
  var colOffset = _controllersLaunchpadGrid2['default'].toNote(col, 0),
      i = num + 1;
  columnOff(lp, col);
  while (i--) {
    on(lp, colOffset + i);
  }
}

function gridOff(lp) {
  var col = 8;
  while (col--) {
    columnOff(lp, col);
  }
}

exports['default'] = { on: on, off: off, flash: flash, columnOn: columnOn, columnOff: columnOff, gridOff: gridOff };
module.exports = exports['default'];
});

require.register("controllers/launchpad/note", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function isSideButton(note) {
  return !(note <= 104 || note > 111);
}

function isTopButton(note) {
  return [8, 24, 40, 56, 72, 88, 104, 120].includes(note);
}

function isGrid(note) {
  return !(isTopButton(note) || isSideButton(note));
}

function isOnMessage(msg) {
  var velocity = msg[2];
  return velocity === 127;
}

exports['default'] = { isSideButton: isSideButton, isTopButton: isTopButton, isGrid: isGrid, isOnMessage: isOnMessage };
module.exports = exports['default'];
});

require.register("controllers/novation-launchcontrol", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _midi = require('midi');

var _midi2 = _interopRequireDefault(_midi);

var launchControl = {};

function printMidiMessage(e) {
  console.log('Got MIDI:', e.data);
}

function initLaunchControl() {
  _midi2['default'].getDevice(function (inp, out) {
    inp.onmidimessage = printMidiMessage;
    launchControl = { input: inp, output: out };
  }, /^Launch Control/);
}

exports['default'] = initLaunchControl;
module.exports = exports['default'];
});

require.register("gibberish-audio", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _state = require('state');

var _state2 = _interopRequireDefault(_state);

var numSynths = 8,
    synths = Array.apply(null, { length: numSynths }),
    numSamples = Math.pow(2, 19);

Gibberish.init();

// First, let's extend the GibberishSampler to run a callback when we want
Gibberish.Sampler.prototype.ontick = function (callback) {
  return callback();
};

var GibberishSamplerSynth = (function () {
  function GibberishSamplerSynth(options) {
    _classCallCheck(this, GibberishSamplerSynth);

    var sampler = new Gibberish.Sampler(options);

    sampler.loops = true;
    sampler.pitch = 1 / 8;
    sampler.playOnLoad = sampler.pitch;
    sampler.connect();

    this.sampler = sampler;
    this.mutedvolume = undefined;
    this.amp = 1;
    this.id = sampler.id;

    // a little hacky, but this is what Gibberish gives us
    // Disabled because it turns out we can meaningfully poll the phase via requestAnimationFrame
    // var sequencer = new Gibberish.Sequencer({
    //   target:sampler,    // attach to the sampler,
    //   key:'ontick',      // ... and invoke its ontick method
    //   durations:[100], // ... every this many samples
    //   values: [ () => { return () => { state.load(sampler.id).phase = sampler.getPhase(); } } ], // ... with a function that returns a function which the ontick method will invoke
    //   shouldKeepOffset: true //TODO should i keep this?
    // });

    // this.sequencer = sequencer;
  }

  _createClass(GibberishSamplerSynth, [{
    key: 'playRatechange',
    value: function playRatechange(factor) {
      this.sampler.pitch *= factor;
      _state2['default'].load(this.id).pitch = this.sampler.pitch;
      return this.sampler.pitch;
    }
  }, {
    key: 'togglemute',
    value: function togglemute() {
      if (this.mutedvolume === undefined) {
        this.mutedvolume = this.volume;
        this.volume = 0.0;
      } else {
        this.volume = this.mutedvolume;
        this.mutedvolume = undefined;
      }
    }
  }, {
    key: 'wavetable',
    set: function set(samples) {
      this.sampler.setBuffer(samples);
      this.sampler.length = samples.length;
      //this.sampler.note(this.sampler.pitch);

      // if (!this.sequencer.isRunning)
      //   this.sequencer.start();
    },
    get: function get() {
      return [this.sampler.getBuffer(), this.sampler.getBuffer()];
    }
  }, {
    key: 'pitch',
    set: function set(pitch) {
      this.sampler.pitch = pitch;
      _state2['default'].load(this.id).pitch = pitch;
    },
    get: function get() {
      return this.sampler.pitch;
    }
  }, {
    key: 'amp',
    set: function set(value) {
      _state2['default'].load(this.id).amp = this.sampler.amp;
      this.sampler.amp = value;
    },
    get: function get() {
      return this.sampler.amp;
    }

    // backwards compatibility
  }, {
    key: 'volume',
    set: function set(value) {
      this.amp = value;
    },

    // backwards compatibility
    get: function get() {
      return this.amp;
    }
  }, {
    key: 'phase',
    set: function set(phase) {
      this.sampler.setPhase(phase);
      //    state.load(this.id).phase = this.sampler.phase;
    },
    get: function get() {
      return this.sampler.getPhase();
    }
  }]);

  return GibberishSamplerSynth;
})();

synths = synths.map(function (e, i) {
  return new GibberishSamplerSynth({ id: i });
});

exports['default'] = { synths: synths, numSamples: numSamples };
module.exports = exports['default'];
});

require.register("gui", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _guiCantor = require('gui/cantor');

var _guiCantor2 = _interopRequireDefault(_guiCantor);

var _state = require('state');

var _state2 = _interopRequireDefault(_state);

var _audio = require('audio');

var _audio2 = _interopRequireDefault(_audio);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _guiThemes = require('gui/themes');

var _guiThemes2 = _interopRequireDefault(_guiThemes);

var canvas = document.querySelector('canvas#fractal-layer'),
    ctx = canvas.getContext('2d'),
    scannerCanvas = document.querySelector('canvas#scanner-layer'),
    scannerCtx = scannerCanvas.getContext('2d'),
    segmentH = window.innerHeight / 8,
    STYLE = _config2['default'].params.VISUALS.STYLE;

function dim(i) {
  return { x: 0, y: i * segmentH, w: window.innerWidth - 150, h: segmentH, segmentId: i };
}

function updateCantor(i, cantorArr) {
  _guiCantor2['default'].plot(ctx, cantorArr, dim(i), STYLE);
}

function updateIterations(i, iterations) {
  var y = i * segmentH + 5,
      x = window.innerWidth - 5;
  ctx.clearRect(x - 25, y, 25, 22);
  ctx.textBaseline = 'hanging';
  ctx.textAlign = 'right';
  ctx.fillStyle = 'grey';
  ctx.font = '22px monospace';
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
  if (n == _state2['default'].focus) ctx.fillStyle = 'white';

  // Display the number of the generator on the right
  //ctx.font         = '22px monospace';
  ctx.fillText(n + 1, x + 50, y + segmentH / 2);

  while (i--) {
    sh = 0 - h * params[i];
    ctx.fillRect(x + 1, y + h, sw - 1, sh);
    x -= sw;
  }
}

// http://jsfiddle.net/chicagogrooves/nRpVD/2/
var fpsInterval = 1000 / _config2['default'].params.VISUALS.FPS,
    startTime = window.performance.now(),
    timeThen = startTime,
    frameCount = 0;
//$osd = document.getElementById("osd"),

function suspendScanners(truefalse) {
  if (truefalse === true) {
    _state2['default'].suspendScanners = true;
  } else {
    _state2['default'].suspendScanners = false;
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
    timeThen = timeNow - elapsed % fpsInterval;

    // draw stuff here       
    scannerCtx.fillStyle = 'white';

    var activeStates = _state2['default'].getActiveStateIds();
    for (var i = 0; i < activeStates.length; i++) {
      var stateid = activeStates[i],
          stateI = _state2['default'].load(stateid);
      if (stateI.updateIterations) {
        updateIterations(stateid, stateI.iterations);
        stateI.updateIterations = false;
      }
      if (stateI.updateCantor) {
        updateCantor(stateid, stateI.cantor);
        stateI.updateCantor = false;
      }

      if (_config2['default'].params.VISUALS.drawScanLines) if (stateI.updateScanner !== false && !_state2['default'].suspendScanners) updateScanner(activeStates[i]);
    }

    // TESTING...Report #seconds since start and achieved fps.
    // var sinceStart = now - startTime;
    // var currentFps = Math.round(1000 / (sinceStart / ++frameCount) * 100) / 100;
    // $osd.innerHTML = "Elapsed time= " + Math.round(sinceStart / 1000 * 100) / 100 + " secs @ " + currentFps + " fps.";
  }
}

function updateScanner(i) {
  var dimI = dim(i),
      stateI = _state2['default'].load(i),
      phaseI = _audio2['default'].synths[i].phase;

  if (stateI.lastphaseOnScreen !== undefined) {
    scannerCtx.clearRect(stateI.lastphaseOnScreen - 1, dimI.y - 1, 2, dimI.h + 2);
    stateI.lastphaseOnScreen = undefined;
  } else {//fallback to clearing the whole segment?
    // scannerCtx.clearRect(dimI.x, dimI.y, dimI.w, dimI.h);
  }

  if (phaseI !== undefined) {
    //FIXME: hacky
    stateI.numSamples = stateI.numSamples || Math.pow(stateI.pattern.length, stateI.iterations);

    // Faster rounding: http://www.html5rocks.com/en/tutorials/canvas/performance/#toc-avoid-float
    // var phaseOnScreen = Math.round( ((phaseI%stateI.numSamples)/stateI.numSamples) * dimI.w + dimI.x );
    var phaseOnScreen = 0.5 + phaseI % stateI.numSamples / stateI.numSamples * dimI.w + dimI.x | 0;

    scannerCtx.fillRect(phaseOnScreen, dimI.y, 1, dimI.h);
    stateI.phase = phaseI;
    stateI.lastphaseOnScreen = phaseOnScreen;
  }
}

function updateAll() {
  var stateI,
      i = 8;
  while (i--) {
    stateI = _state2['default'].load(i);
    if (stateI.cantor !== undefined) {
      updateCantor(i, stateI.cantor);
    }
    if (stateI.iterations !== undefined) {
      updateIterations(i, stateI.iterations);
    }

    // redraw the sliders too
    updateSliders(i, stateI.pattern);
  }
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 4;

  scannerCanvas.width = canvas.width;
  scannerCanvas.height = canvas.height;
}

function isHidden(el) {
  return el.offsetParent === null;
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
    req.addEventListener("load", function () {
      var s = req.responseText;
      if (req.status == 200) {
        var b = s.indexOf("### Keyboard Controls");
        var e = s.indexOf("## Notes");
        usageText = s.substring(b, e).replace(/```/g, '');
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

exports['default'] = { updateCantor: updateCantor, updateIterations: updateIterations, updateSliders: updateSliders, suspendScanners: suspendScanners, updateAll: updateAll, toggleHelp: toggleHelp, STYLE: STYLE };
module.exports = exports['default'];
});

require.register("gui/cantor", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _guiThemes = require('gui/themes');

var _guiThemes2 = _interopRequireDefault(_guiThemes);

function plotIteration(ctx, iteration, dimensions, STYLE) {
  if (typeof iteration === "undefined") return;

  var i = iteration.length,
      segmentW = dimensions.w / i,
      c,
      y,
      h,
      s,
      l;

  var currentPalette = _guiThemes2['default'].currentPalette.palette;

  if (STYLE.withColours) while (i--) {
    // more fun
    // c = Math.round(360 * iteration[i]);
    // ctx.fillStyle = `hsl(${c}, 60%, 60%)`;

    // more accurate
    // c = Math.round(100 * iteration[i]);    
    // ctx.fillStyle = `hsl(12, ${c}%, ${c}%)`;

    //solarized & accurate (we vary the lightness/brightness of the colours)
    c = Math.round(100 * iteration[i]);
    h = currentPalette[dimensions.segmentId][0];
    s = currentPalette[dimensions.segmentId][1];
    //if (STYLE.invertColours) c = 100-c;
    ctx.fillStyle = 'hsl(' + h + ', ' + s + '%, ' + c + '%)';

    y = dimensions.y;
    ctx.fillRect(segmentW * i, y, segmentW, dimensions.h);
  } else while (i--) {
    c = Math.round(255 * iteration[i]);
    if (STYLE.invertColours) c = 255 - c;
    ctx.fillStyle = 'rgb(' + c + ', ' + c + ', ' + c + ')';

    y = dimensions.y;
    ctx.fillRect(segmentW * i, y, segmentW, dimensions.h);
  }
}

function plot(ctx, cantor, dimensions, STYLE) {
  var numLevels = Math.min(cantor.length, 8),
      i = numLevels,
      h = dimensions.h,
      dim;

  if (!STYLE.drawAllLevels) {
    dim = Object.create(dimensions);
    plotIteration(ctx, cantor[i - 1], dim, STYLE);
  } else {
    dimensions.h = h / numLevels;

    while (i--) {
      dim = Object.create(dimensions);
      if (STYLE.drawLevelsTopDown) dim.y = dim.y + dim.h * i;else dim.y = dim.y + dim.h * (numLevels - i);
      dim.level = i;
      plotIteration(ctx, cantor[i - 1], dim, STYLE);
    }
  }
}

exports['default'] = { plot: plot };
module.exports = exports['default'];
});

require.register("gui/palette/colors-by-decade", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _utils = require('utils');

var Utils = _interopRequireWildcard(_utils);

function transform_to_hsl(palette) {
  var transformed = {};

  Object.keys(palette).forEach(function (decade) {
    var colours = palette[decade];
    transformed[decade] = colours.map(function (hsb) {
      return Utils.hsv_to_hsl(360 * hsb["hue"], hsb["saturation"], hsb["brightness"]);
    });
  });

  return transformed;
}

var palette = {
  "1900s": [{
    "hue": 0.08333328,
    "saturation": 0.2089552,
    "brightness": 0.5254902
  }, {
    "hue": 0.1388889,
    "saturation": 0.6875,
    "brightness": 0.3764706
  }, {
    "hue": 0.1203704,
    "saturation": 0.07792208,
    "brightness": 0.9058824
  }, {
    "hue": 0.07246377,
    "saturation": 0.1949152,
    "brightness": 0.9254902
  }, {
    "hue": 0.06578946,
    "saturation": 0.6867469,
    "brightness": 0.6509804
  }, {
    "hue": 0.02927928,
    "saturation": 0.4134078,
    "brightness": 0.7019608
  }, {
    "hue": 0.517284,
    "saturation": 1,
    "brightness": 0.5294118
  }, {
    "hue": 0.3695652,
    "saturation": 0.184,
    "brightness": 0.4901961
  }],
  "1910s": [{
    "hue": 0.1090225,
    "saturation": 0.7916666,
    "brightness": 0.6588235
  }, {
    "hue": 0.1512346,
    "saturation": 0.2432432,
    "brightness": 0.8705882
  }, {
    "hue": 0.1111111,
    "saturation": 0.6195652,
    "brightness": 0.3607843
  }, {
    "hue": 0.6780303,
    "saturation": 0.34375,
    "brightness": 0.5019608
  }, {
    "hue": 0.5407125,
    "saturation": 1,
    "brightness": 0.5137255
  }, {
    "hue": 0.2142857,
    "saturation": 0.4336283,
    "brightness": 0.4431373
  }, {
    "hue": 0.02141528,
    "saturation": 0.7920354,
    "brightness": 0.8862745
  }, {
    "hue": 0.5498084,
    "saturation": 1,
    "brightness": 0.3411765
  }],
  "1920s": [{
    "hue": 0.07407407,
    "saturation": 0.04736842,
    "brightness": 0.7450981
  }, {
    "hue": 0.03030304,
    "saturation": 0.34375,
    "brightness": 0.3764706
  }, {
    "hue": 0.04964538,
    "saturation": 0.5026738,
    "brightness": 0.7333333
  }, {
    "hue": 0.9785478,
    "saturation": 0.4879227,
    "brightness": 0.8117647
  }, {
    "hue": 0.1134752,
    "saturation": 0.5053763,
    "brightness": 0.7294118
  }, {
    "hue": 0.25,
    "saturation": 0.2368421,
    "brightness": 0.5960785
  }, {
    "hue": 0.5729167,
    "saturation": 0.6829268,
    "brightness": 0.6431373
  }, {
    "hue": 0.9583333,
    "saturation": 0.1142858,
    "brightness": 0.1372549
  }],
  "1930s": [{
    "hue": 0.5855856,
    "saturation": 0.578125,
    "brightness": 0.2509804
  }, {
    "hue": 0.1267056,
    "saturation": 0.6705883,
    "brightness": 1
  }, {
    "hue": 0.1195652,
    "saturation": 0.9055118,
    "brightness": 0.9960784
  }, {
    "hue": 0.9869685,
    "saturation": 1,
    "brightness": 0.9529412
  }, {
    "hue": 0.06814449,
    "saturation": 0.8319672,
    "brightness": 0.9568627
  }, {
    "hue": 0.4112903,
    "saturation": 1,
    "brightness": 0.4862745
  }, {
    "hue": 0.1111111,
    "saturation": 0.6195652,
    "brightness": 0.3607843
  }, {
    "hue": 0.7424242,
    "saturation": 0.5,
    "brightness": 0.5176471
  }],
  "1940s": [{
    "hue": 0.4147727,
    "saturation": 1,
    "brightness": 0.6901961
  }, {
    "hue": 0.550505,
    "saturation": 0.45,
    "brightness": 0.8627451
  }, {
    "hue": 0.1529126,
    "saturation": 0.8547718,
    "brightness": 0.945098
  }, {
    "hue": 0.9866667,
    "saturation": 0.952381,
    "brightness": 0.8235294
  }, {
    "hue": 0.06696429,
    "saturation": 0.4462151,
    "brightness": 0.9843137
  }, {
    "hue": 0.4009662,
    "saturation": 0.3382353,
    "brightness": 0.8
  }, {
    "hue": 0.1349206,
    "saturation": 0.1666667,
    "brightness": 0.9882353
  }, {
    "hue": 0.06060606,
    "saturation": 0.1973094,
    "brightness": 0.8745098
  }],
  "1950s": [{
    "hue": 0.1315359,
    "saturation": 0.8395061,
    "brightness": 0.9529412
  }, {
    "hue": 0.08553794,
    "saturation": 0.7590362,
    "brightness": 0.9764706
  }, {
    "hue": 0.1880631,
    "saturation": 0.7668394,
    "brightness": 0.7568628
  }, {
    "hue": 0.5,
    "saturation": 0.03305785,
    "brightness": 0.9490196
  }, {
    "hue": 0.5793651,
    "saturation": 0.1858407,
    "brightness": 0.4431373
  }, {
    "hue": 0.7192982,
    "saturation": 0.3220339,
    "brightness": 0.2313726
  }, {
    "hue": 0.4791667,
    "saturation": 0.1818182,
    "brightness": 0.6901961
  }, {
    "hue": 0.9866667,
    "saturation": 0.09803921,
    "brightness": 1
  }, {
    "hue": 0.5050505,
    "saturation": 0.1563981,
    "brightness": 0.827451
  }, {
    "hue": 0.1349206,
    "saturation": 0.1666667,
    "brightness": 0.9882353
  }, {
    "hue": 0.5815603,
    "saturation": 0.2034632,
    "brightness": 0.9058824
  }, {
    "hue": 0.07861635,
    "saturation": 0.2086614,
    "brightness": 0.9960784
  }, {
    "hue": 0.7878788,
    "saturation": 0.04526749,
    "brightness": 0.9529412
  }, {
    "hue": 0.9467593,
    "saturation": 0.3333333,
    "brightness": 0.8470588
  }],
  "1960s": [{
    "hue": 0.1858974,
    "saturation": 0.751445,
    "brightness": 0.6784314
  }, {
    "hue": 0.1581699,
    "saturation": 1,
    "brightness": 1
  }, {
    "hue": 0.9645594,
    "saturation": 0.9942857,
    "brightness": 0.6862745
  }, {
    "hue": 0.07962963,
    "saturation": 0.8035714,
    "brightness": 0.8784314
  }, {
    "hue": 0.5673289,
    "saturation": 1,
    "brightness": 0.5921569
  }, {
    "hue": 0.9171123,
    "saturation": 0.8461539,
    "brightness": 0.8666667
  }, {
    "hue": 0.1645833,
    "saturation": 0.8163264,
    "brightness": 0.7686275
  }, {
    "hue": 0.7424242,
    "saturation": 0.5,
    "brightness": 0.5176471
  }],
  "1970s": [{
    "hue": 0.5626667,
    "saturation": 1,
    "brightness": 0.4901961
  }, {
    "hue": 0.1818182,
    "saturation": 0.2699386,
    "brightness": 0.6392157
  }, {
    "hue": 0.1134752,
    "saturation": 0.5053763,
    "brightness": 0.7294118
  }, {
    "hue": 0.03030304,
    "saturation": 0.34375,
    "brightness": 0.3764706
  }, {
    "hue": 0.9862259,
    "saturation": 0.7117647,
    "brightness": 0.6666667
  }, {
    "hue": 0.08280256,
    "saturation": 0.7548077,
    "brightness": 0.8156863
  }, {
    "hue": 0.1309524,
    "saturation": 0.7909604,
    "brightness": 0.6941177
  }, {
    "hue": 0.1645022,
    "saturation": 0.6637931,
    "brightness": 0.454902
  }],
  "1980s": [{
    "hue": 0.1742919,
    "saturation": 0.7927461,
    "brightness": 0.7568628
  }, {
    "hue": 0.5454546,
    "saturation": 0.8571429,
    "brightness": 0.9058824
  }, {
    "hue": 0.7342995,
    "saturation": 0.3942857,
    "brightness": 0.6862745
  }, {
    "hue": 0.9731182,
    "saturation": 0.5123967,
    "brightness": 0.9490196
  }, {
    "hue": 0.8651685,
    "saturation": 0.4917127,
    "brightness": 0.7098039
  }, {
    "hue": 0.4444444,
    "saturation": 0.01463415,
    "brightness": 0.8039216
  }, {
    "hue": 0.5749441,
    "saturation": 1,
    "brightness": 0.5843138
  }, {
    "hue": 0.9583333,
    "saturation": 0.1142858,
    "brightness": 0.1372549
  }],
  "1990s": [{
    "hue": 0.1527778,
    "saturation": 0.3348837,
    "brightness": 0.8431373
  }, {
    "hue": 0.3937198,
    "saturation": 0.4539474,
    "brightness": 0.5960785
  }, {
    "hue": 0.2314815,
    "saturation": 0.1978022,
    "brightness": 0.7137255
  }, {
    "hue": 0.5447155,
    "saturation": 0.1889401,
    "brightness": 0.8509804
  }, {
    "hue": 0.5,
    "saturation": 0.03305785,
    "brightness": 0.9490196
  }, {
    "hue": 0.6238095,
    "saturation": 0.3333333,
    "brightness": 0.8235294
  }, {
    "hue": 0.9012821,
    "saturation": 0.6666666,
    "brightness": 0.7647059
  }, {
    "hue": 0.8282828,
    "saturation": 0.5,
    "brightness": 0.5176471
  }],

  "2000s": [{
    "hue": 0.9791667,
    "saturation": 0.75,
    "brightness": 0.5019608
  }, {
    "hue": 0.06578946,
    "saturation": 0.6867469,
    "brightness": 0.6509804
  }, {
    "hue": 0.5498084,
    "saturation": 1,
    "brightness": 0.3411765
  }, {
    "hue": 0.1587302,
    "saturation": 0.42,
    "brightness": 0.1960784
  }, {
    "hue": 0.9944071,
    "saturation": 0.8232045,
    "brightness": 0.7098039
  }, {
    "hue": 0.5442891,
    "saturation": 1,
    "brightness": 0.5607843
  }, {
    "hue": 0.1563218,
    "saturation": 0.8238636,
    "brightness": 0.6901961
  }, {
    "hue": 0.1134752,
    "saturation": 0.5053763,
    "brightness": 0.7294118
  }]
};

var palette = transform_to_hsl(palette);

exports['default'] = { palette: palette };
module.exports = exports['default'];
});

require.register("gui/palette/pantone-color-of-the-year", function(exports, require, module) {
// http://blog.eliteemail.com/2013/01/03/pantone-color-of-the-year-2013/
// http://colorizer.org/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var palette = [hsl(237.6, 0, 296, 0.504), //blue izis, 2008
hsl(42.3, 0.832, 0.625), //mimosa, 2009
hsl(173.7, 0.455, 0.496), //turquoise, 2010
hsl(343, 0.62, 0.576), //honeysuckle, 2011
hsl(9.4, 0.731, 0.504), //tangerine tango, 2012
hsl(166.1, 1.0, 0.304), //emerald, 2013
hsl(310.8, 0.333, 0.541), //radiant orchid, 2014
hsl(0.9, 0.296, 0.451) //marsala, 2015
];

function hsl(h, s, l) {
  //return { "hue": h, "saturation": s, "lightness": l };
  return [h, s * 100, l * 100];
}

exports["default"] = { palette: palette };
module.exports = exports["default"];
});

require.register("gui/palette/solarized", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _utils = require('utils');

var Utils = _interopRequireWildcard(_utils);

var palette = [[45, 100, 71], //yellow
[18, 89, 80], //orange
[1, 79, 86], //red
[331, 74, 83], //magenta
[237, 45, 77], //violet
[205, 82, 82], //blue
[175, 74, 63], //cyan
[68, 100, 60] //green
];

palette = palette.map(function (hsv) {
  return Utils.hsv_to_hsl(hsv[0], hsv[1] / 100, hsv[2] / 100);
});

exports['default'] = { palette: palette };
module.exports = exports['default'];
});

require.register("gui/themes", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _guiPaletteColorsByDecade = require('gui/palette/colors-by-decade');

var _guiPaletteColorsByDecade2 = _interopRequireDefault(_guiPaletteColorsByDecade);

var _guiPalettePantoneColorOfTheYear = require('gui/palette/pantone-color-of-the-year');

var _guiPalettePantoneColorOfTheYear2 = _interopRequireDefault(_guiPalettePantoneColorOfTheYear);

var _guiPaletteSolarized = require('gui/palette/solarized');

var _guiPaletteSolarized2 = _interopRequireDefault(_guiPaletteSolarized);

var _utils = require('utils');

var palettes = {
  "solarized": _guiPaletteSolarized2['default'].palette,
  "pantone 2008-2015": _guiPalettePantoneColorOfTheYear2['default'].palette
};
Object.assign(palettes, _guiPaletteColorsByDecade2['default'].palette);

var currentPalette = { name: "solarized", palette: _guiPaletteSolarized2['default'].palette };

var nextPaletteName = (0, _utils.makeCircularGenerator)(Object.keys(palettes));

function nextPalette() {
  var name = nextPaletteName();

  while (name === currentPalette.name) name = nextPaletteName();

  currentPalette = { name: name, palette: palettes[name] };

  return currentPalette;
}

exports['default'] = { palettes: palettes, nextPalette: nextPalette, currentPalette: currentPalette };
module.exports = exports['default'];
});

require.register("main", function(exports, require, module) {
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _player = require('player');

var _player2 = _interopRequireDefault(_player);

var _controllersLaunchpad = require('controllers/launchpad');

var _controllersLaunchpad2 = _interopRequireDefault(_controllersLaunchpad);

var _controllersNovationLaunchcontrol = require('controllers/novation-launchcontrol');

var _controllersNovationLaunchcontrol2 = _interopRequireDefault(_controllersNovationLaunchcontrol);

var _controllersCmdLc1 = require('controllers/cmd-lc1');

var _controllersCmdLc12 = _interopRequireDefault(_controllersCmdLc1);

var _controllersKeyboard = require('controllers/keyboard');

var _controllersKeyboard2 = _interopRequireDefault(_controllersKeyboard);

var _midi = require('midi');

var _state = require('state');

var _state2 = _interopRequireDefault(_state);

var _gui = require('gui');

var _gui2 = _interopRequireDefault(_gui);

var _controllersCmdLc1Controls = require('controllers/cmd-lc1/controls');

var _controllersCmdLc1Controls2 = _interopRequireDefault(_controllersCmdLc1Controls);

var _audio = require('audio');

var _audio2 = _interopRequireDefault(_audio);

//window.audio = audio;
//window.state = state;
// window.controls = controls;

// Recreate the instrument state from the URL

window.player = _player2['default'];
window.play = _player2['default'].play;
window.playDebounced = _player2['default'].playDebounced;

window.initLaunchpad = _controllersLaunchpad2['default'];
window.initLaunchControl = _controllersNovationLaunchcontrol2['default'];
window.initCMDLC1 = _controllersCmdLc12['default'];
window.initKeyboard = _controllersKeyboard2['default'];

(0, _controllersKeyboard2['default'])();

window.availableDevices = _midi.availableDevices;

if (_state2['default'].loadFromURL()) {

  // initialise (all) the controls from the state
  _controllersCmdLc1Controls2['default'].init();

  // these are the states that have been initialised
  var activeStateIds = _state2['default'].getActiveStateIds();

  // load synth parameters (amp, pitch, phase, etc) from the states
  _audio2['default'].loadSynthParamsFromState(activeStateIds);

  // force cantor data re-generation and play
  activeStateIds.map(function (id, i) {
    _controllersCmdLc1Controls2['default'].setFocus(id);_controllersCmdLc1Controls2['default'].adjustPattern({ encoder: id, change: 0 });
  });
}
});

;require.register("midi", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var midiAccess;

function findDevice(devices, nameRegex) {
  var result = devices.next();
  while (!result.done) {
    if (nameRegex.test(result.value.name)) {
      return result.value;
    }
    result = devices.next();
  }
}

// Callback gets the input and output as arguments
// Name should be a regex
//
function getDevice(cb, nameRegex) {
  navigator.requestMIDIAccess().then(function (midiAccess) {
    var inputs = midiAccess.inputs.values(),
        outputs = midiAccess.outputs.values(),
        input = findDevice(inputs, nameRegex),
        output = findDevice(outputs, nameRegex);
    cb(input, output);
  }, function () {
    console.log('Failed to get midi access.');
  });
}

exports['default'] = { getDevice: getDevice };
module.exports = exports['default'];
});

require.register("native-audio", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _state = require('state');

var _state2 = _interopRequireDefault(_state);

var numSynths = 8,
    audioCtxConstructor = window.AudioContext || window.webkitAudioContext,
    audioCtx = new audioCtxConstructor(),
    numSamples = Math.pow(2, 19),
    synths = Array.apply(null, { length: numSynths });

var WavetableSynth = (function () {
  function WavetableSynth(options) {
    _classCallCheck(this, WavetableSynth);

    // forward compatilibity
    this.id = options.id;
    var source = audioCtx.createBufferSource(),
        buffer = audioCtx.createBuffer(2, numSamples, audioCtx.sampleRate);
    var mutedvolume = undefined;
    this.channels = {
      left: buffer.getChannelData(0),
      right: buffer.getChannelData(1)
    };
    this.source = source;
    this.gain = audioCtx.createGain();
    source.playbackRate.value = 1 / 8;
    source.loop = true;
    source.buffer = buffer;
    source.connect(this.gain);
    this.gain.connect(audioCtx.destination);
    source.start();
  }

  _createClass(WavetableSynth, [{
    key: 'playRatechange',
    value: function playRatechange(factor) {
      var rate = this.source.playbackRate.value;
      rate *= factor;
      // if (rate > 1)
      //   rate = 1;
      this.source.playbackRate.value = rate;
      _state2['default'].load(this.id).pitch = rate;
      return rate;
    }

    // forward compatibility
  }, {
    key: 'togglemute',
    value: function togglemute() {
      if (this.mutedvolume === undefined) {
        this.mutedvolume = this.gain.gain.value;
        this.gain.gain.value = 0.0;
      } else {
        this.gain.gain.value = this.mutedvolume;
        this.mutedvolume = undefined;
      }
    }

    // forward compatilibity
  }, {
    key: 'wavetable',
    set: function set(samples) {
      var numFrames = samples.length,
          left = this.channels.left,
          right = this.channels.right,
          len,
          i;

      //console.log(numFrames /*2^14*/, left.length /*2^19*/);

      for (i = 0, len = left.length; i < len; i++) {
        left[i] = samples[i % numFrames];
        right[i] = samples[i % numFrames];
      }
    },
    get: function get() {
      return [this.channels.left, this.channels.right];
    }

    // forward compatibility
  }, {
    key: 'pitch',
    set: function set(pitch) {
      this.source.playbackRate.value = pitch;
      _state2['default'].load(this.id).pitch = pitch;
    },

    // forward compatibility
    get: function get() {
      return this.source.playbackRate;
    }
  }, {
    key: 'amp',
    set: function set(value) {
      this.volume = value;
      _state2['default'].load(this.id).amp = value;
    },

    // forward compatibility
    get: function get() {
      return this.volume;
    }
  }, {
    key: 'volume',
    set: function set(value) {
      this.gain.gain.value = value;
    },
    get: function get() {
      return this.gain.gain.value;
    }
  }, {
    key: 'phase',
    set: function set(phase) {},
    get: function get() {
      return 0;
    }
  }]);

  return WavetableSynth;
})();

synths = synths.map(function (e, i) {
  return new WavetableSynth({ id: i });
});

exports['default'] = { synths: synths, numSamples: numSamples };
module.exports = exports['default'];
});

require.register("new-audio", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _state = require('state');

var _state2 = _interopRequireDefault(_state);

var numSynths = 8,
    audioCtxConstructor = window.AudioContext || window.webkitAudioContext,
    audioCtx = new audioCtxConstructor(),
    numSamples = Math.pow(2, 19),
    synths = Array.apply(null, { length: numSynths });

function createBufferSource(audioCtx) {
  var type = arguments.length <= 1 || arguments[1] === undefined ? "SPAudioBufferSourceNode" : arguments[1];

  if (type === "SPAudioBufferSourceNode") {
    return new SPAudioBufferSourceNode(audioCtx);
  } else if (type === "AudioBufferSourceNode") {
    return audioCtx.createBufferSource();
  } else {
    return audioCtx.createBufferSource();
  }
}

function createBuffer(audioCtx, numSamplesOrSamplesArray) {
  var numChannels = arguments.length <= 2 || arguments[2] === undefined ? 2 : arguments[2];
  var sampleRate = arguments.length <= 3 || arguments[3] === undefined ? audioCtx.sampleRate : arguments[3];
  return (function () {
    if (typeof numSamplesOrSamplesArray === "number") {
      return audioCtx.createBuffer(numChannels, numSamplesOrSamplesArray, sampleRate);
    } else if (Array.isArray(numSamplesOrSamplesArray)) {
      var samples = numSamplesOrSamplesArray,
          numSamples = samples.length,
          buffer = audioCtx.createBuffer(numChannels, numSamples, sampleRate),
          channels = [];
      for (var i = 0; i < numChannels; i++) {
        channels[i] = buffer.getChannelData(i);
      }
      for (var j = 0; j < numSamples; j++) {
        for (var i = 0; i < numChannels; i++) {
          channels[i][j] = samples[j];
        }
      }
      return buffer;
    } else {
      return null;
    }
  })();
}

var WavetableSynth = (function () {
  function WavetableSynth(options) {
    _classCallCheck(this, WavetableSynth);

    // forward compatilibity
    this.id = options.id;
    this.bufferSourceNodeType = options.bufferSourceNodeType || "SPAudioBufferSourceNode";

    var source = createBufferSource(audioCtx, this.bufferSourceNodeType),
        buffer = createBuffer(audioCtx, numSamples, 2, audioCtx.sampleRate);

    this.source = source;
    source.buffer = buffer;
    source.loop = true;

    // FIXME: this has no effect here on firefox?!? it insists on setting it on 1
    source.playbackRate.value = 1 / 8;

    this.gain = audioCtx.createGain();
    source.connect(this.gain);
    this.gain.connect(audioCtx.destination);
    this.mutedvolume = undefined;

    source.start();
  }

  _createClass(WavetableSynth, [{
    key: 'playRatechange',
    value: function playRatechange(factor) {
      this.source.playbackRate.value *= factor;
      _state2['default'].load(this.id).pitch = this.source.playbackRate.value;
    }

    // forward compatibility
  }, {
    key: 'togglemute',
    value: function togglemute() {
      if (this.mutedvolume === undefined) {
        this.mutedvolume = this.gain.gain.value;
        this.gain.gain.value = 0.0;
      } else {
        this.gain.gain.value = this.mutedvolume;
        this.mutedvolume = undefined;
      }
    }

    // forward compatilibity
  }, {
    key: 'wavetable',
    set: function set(samples) {

      var source = createBufferSource(audioCtx, this.bufferSourceNodeType);

      if (samples instanceof AudioBuffer) {
        source.buffer = samples;
      } else if (Array.isArray(samples)) {
        source.buffer = createBuffer(audioCtx, samples, 2, audioCtx.sampleRate);
      } else {
        source.buffer = this.source.buffer;
      }

      source.loop = this.source.loop;
      source.playbackRate.value = this.source.playbackRate.value;
      if (source.playbackPosition && this.source.playbackPosition) source.playbackPosition = this.source.playbackPosition;

      source.connect(this.gain);
      source.start();

      // disconnect the old source after starting the new one for a smoother transition
      this.source.disconnect();

      this.source = source;
    },
    get: function get() {
      var buffer = this.source.buffer;
      return [buffer.getChannelData(0), buffer.getChannelData(1)];
    }

    // forward compatibility
  }, {
    key: 'pitch',
    set: function set(pitch) {
      this.source.playbackRate.value = pitch;
      _state2['default'].load(this.id).pitch = pitch;
    },

    // forward compatibility
    get: function get() {
      return this.source.playbackRate.value;
    }
  }, {
    key: 'amp',
    set: function set(value) {
      this.volume = value;
      _state2['default'].load(this.id).amp = value;
    },

    // forward compatibility
    get: function get() {
      return this.volume;
    }
  }, {
    key: 'volume',
    set: function set(value) {
      this.gain.gain.value = value;
    },
    get: function get() {
      return this.gain.gain.value;
    }
  }, {
    key: 'phase',
    set: function set(phase) {
      this.wavetable = this.source.buffer;
    },
    get: function get() {
      return this.source.playbackPosition || "undefined";
    }
  }]);

  return WavetableSynth;
})();

synths = synths.map(function (e, i) {
  return new WavetableSynth({ id: i });
});

exports['default'] = { synths: synths, numSamples: numSamples };
module.exports = exports['default'];
});

require.register("player", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _audio = require('audio');

var _audio2 = _interopRequireDefault(_audio);

var _gui = require('gui');

var _gui2 = _interopRequireDefault(_gui);

var _state = require('state');

var _state2 = _interopRequireDefault(_state);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var debouncedTimeouts = [],
    workers = [];

function updateSynthAndGUI(i, data) {
  var cantor = data.cantor,
      wavetable = cantor[cantor.length - 1];
  _state2['default'].save(i, data);
  _audio2['default'].synths[i].wavetable = wavetable;

  if (_config2['default'].params.AUDIO.resetPhaseOnNewBuffer) {
    _state2['default'].load(i).phase = 0;
    _audio2['default'].synths[i].phase = 0;
  }

  // see gui.updateFrame where these are acted upon
  _state2['default'].load(i).updateCantor = true;
  _state2['default'].load(i).updateIterations = true;

  // used to be drawn here
  // gui.updateIterations(i, data.iterations); //BE-raf:to-remove
  // gui.updateCantor(i, cantor); //BE-raf:to-remove
}

function resetWorker(i, cb) {
  if (workers[i] && workers[i].terminate) {
    workers[i].terminate();
  }
  workers[i] = new Worker('worker/cantor.js');
  workers[i].onmessage = cb;
}

function play(i, pattern, iterations) {
  var cb,
      data = { pattern: pattern, iterations: iterations };
  cb = function (e) {
    data.cantor = e.data;
    updateSynthAndGUI(i, data);
  };
  resetWorker(i, cb);
  workers[i].postMessage([pattern, iterations]);
}

function playDebounced(i, pattern, iterations) {
  var timeout = arguments.length <= 3 || arguments[3] === undefined ? 250 : arguments[3];

  clearTimeout(debouncedTimeouts[i]);
  debouncedTimeouts[i] = setTimeout(function () {
    return play(i, pattern, iterations);
  }, timeout);
}

function togglemute(i) {
  _audio2['default'].synths[i].togglemute();
}

function volume(i, value, isdelta) {
  var vol = _audio2['default'].synths[i].volume;

  if (isdelta) vol = vol + value;else vol = value;

  if (vol < 0.0) vol = 0;
  if (vol > 10.0) vol = 10.0;

  _audio2['default'].synths[i].volume = vol;
}

function playRatechange(i, factor) {
  _audio2['default'].synths[i].playRatechange(factor);
}

exports['default'] = { play: play, playDebounced: playDebounced, volume: volume, togglemute: togglemute, playRatechange: playRatechange };
module.exports = exports['default'];
});

require.register("state", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var state = [],
    focus = undefined,
    buffer = undefined;

function save(i, data) {
  state[i] = Object.assign({}, state[i], data);
}

function load(i) {
  return state[i] || { iterations: 7, pattern: [0.5, 0.5, 0.5, 0.5], numSamples: Math.pow(4, 7), phase: undefined, lastphaseOnScreen: undefined };
}

function toJSON() {
  //var selector = function(key,value) { if (key === "cantor") { return undefined; } else { return value;} }
  var selector = ["iterations", "pattern", "amp", "pitch", "phase"];
  return JSON.stringify(state, selector);
}

function setFromJSON(json) {
  state = JSON.parse(json);
}

// state -> url
function saveToURL() {
  var data = encodeURI(toJSON());
  // var url = window.location.protocol
  //     + "//"
  //     + window.location.hostname
  //     + ":"
  //     + window.location.port
  //     + "/"
  //     + "#"
  //     + data;

  window.location.href = "#STATE:" + data;
  return window.location.href;
}

// url -> state
function loadFromURL(url) {
  var url = url || window.location.href;
  var json = decodeURI(url).split(/#STATE:/)[1];
  if (json !== undefined) {
    setFromJSON(json);
    //FIXME: hacky
    state.forEach(function (s) {
      if (s && s.pattern && s.iterations) s.numSamples = Math.pow(s.pattern.length, s.iterations);
    });
    return true;
  } else {
    return false;
  }
}

function copytobuffer(i) {
  buffer = Object.assign({}, state[i]);
  buffer.phase = buffer.lastphaseOnScreen = undefined; // don't copy these for now
}

function savefrombuffer(i) {
  if (!buffer) return false;
  state[i] = buffer;
  state[i].pattern = buffer.pattern.slice(0);
  return state[i];
}

function getActiveStateIds() {
  var active = [];
  for (var i = 0; i < state.length; i++) {
    if (state[i]) {
      active.push(i);
    }
  }
  return active;
}

exports["default"] = { save: save, load: load, focus: focus, copytobuffer: copytobuffer, savefrombuffer: savefrombuffer, toJSON: toJSON, setFromJSON: setFromJSON, saveToURL: saveToURL, loadFromURL: loadFromURL, getActiveStateIds: getActiveStateIds };
module.exports = exports["default"];
});

require.register("utils", function(exports, require, module) {
'use strict';

// http://stackoverflow.com/questions/3423214/convert-hsb-hsv-color-to-hsl
Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.hsv_to_hsl = hsv_to_hsl;
exports.makeCircularGenerator = makeCircularGenerator;

function hsv_to_hsl(h, s, v) {
    var asPercentages = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

    // both hsv and hsl values are in [0, 1]
    var l = (2 - s) * v / 2;

    if (l != 0) {
        if (l == 1) {
            s = 0;
        } else if (l < 0.5) {
            s = s * v / (l * 2);
        } else {
            s = s * v / (2 - l * 2);
        }
    }

    if (asPercentages) return [h, s * 100, l * 100];else return [h, s, l];
}

function makeCircularGenerator(array) {
    var nextIndex = 0;
    return function () {
        return array[nextIndex++ % array.length];
    };
}

//export default { hsv_to_hsl };
});


//# sourceMappingURL=main.js.map