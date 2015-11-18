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
      return require(absolute, path);
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

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var numSynths = 8,
    audioCtxConstructor = window.AudioContext || window.webkitAudioContext,
    audioCtx = new audioCtxConstructor(),
    numSamples = Math.pow(2, 19),
    synths = Array.apply(null, { length: numSynths });

var WavetableSynth = (function () {
  function WavetableSynth() {
    _classCallCheck(this, WavetableSynth);

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
      if (rate > 1) rate = 1;
      this.source.playbackRate.value = rate;
      return rate;
    }
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
  }, {
    key: 'volume',
    set: function set(value) {
      this.gain.gain.value = value;
    },
    get: function get() {
      return this.gain.gain.value;
    }
  }]);

  return WavetableSynth;
})();

synths = synths.map(function () {
  return new WavetableSynth();
});

exports['default'] = { synths: synths, numSamples: numSamples };
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

var _gibberishAudio = require('gibberish-audio');

var _gibberishAudio2 = _interopRequireDefault(_gibberishAudio);

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
    _gibberishAudio2['default'].loadSynthParamsFromState([_state2['default'].focus]);
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
    return _gibberishAudio2['default'].allSynthsButFocused(function (s) {
      _player2['default'].volume(s.id, -0.1, true);
    });
  });
  key('alt+=', function () {
    return _gibberishAudio2['default'].allSynthsButFocused(function (s) {
      _player2['default'].volume(s.id, 0.1, true);
    });
  });
  key('alt+0', function () {
    return _gibberishAudio2['default'].allSynthsButFocused(function (s) {
      _player2['default'].togglemute(s.id);
    });
  });

  // control the volume of all generators
  key('shift+-', function () {
    return _gibberishAudio2['default'].allSynths(function (s) {
      _player2['default'].volume(s.id, -0.1, true);
    });
  });
  key('shift+=', function () {
    return _gibberishAudio2['default'].allSynths(function (s) {
      _player2['default'].volume(s.id, 0.1, true);
    });
  });
  key('shift+0', function () {
    return _gibberishAudio2['default'].allSynths(function (s) {
      _player2['default'].togglemute(s.id);
    });
  });

  /* PITCH (PLAYRATE) */

  var PLAYRATE_UP_FACTOR = Math.sqrt(2),
      PLAYRATE_DOWN_FACTOR = 1 / PLAYRATE_UP_FACTOR;

  // control the pitch (playrate) of the focused generator
  key(',', function () {
    return _gibberishAudio2['default'].focusedSynth(function (s) {
      return s.playRatechange(PLAYRATE_DOWN_FACTOR);
    });
  });
  key('.', function () {
    return _gibberishAudio2['default'].focusedSynth(function (s) {
      return s.playRatechange(PLAYRATE_UP_FACTOR);
    });
  });
  key('m', function () {
    return _gibberishAudio2['default'].focusedSynth(function (s) {
      s.pitch = 1 / 8;
    });
  });

  // control the pitch (playrate) of all but the focused generator
  key('alt+,', function () {
    return _gibberishAudio2['default'].allSynthsButFocused(function (s) {
      s.playRatechange(PLAYRATE_DOWN_FACTOR);
    });
  });
  key('alt+.', function () {
    return _gibberishAudio2['default'].allSynthsButFocused(function (s) {
      s.playRatechange(PLAYRATE_UP_FACTOR);
    });
  });
  key('alt+m', function () {
    return _gibberishAudio2['default'].allSynthsButFocused(function (s) {
      s.pitch = 1 / 8;
    });
  });

  // control the pitch (playrate) of all generators
  key('shift+m', function () {
    return _gibberishAudio2['default'].allSynths(function (s) {
      s.pitch = 1 / 8;
    });
  });

  /* PHASE */

  // control the phase of the focused generator
  key('p', function () {
    return _gibberishAudio2['default'].focusedSynth(function (s) {
      s.phase = 0;
    });
  });

  // control the phase of all but the focused generator
  key('alt+p', function () {
    return _gibberishAudio2['default'].allSynthsButFocused(function (s) {
      s.phase = 0;
    });
  });

  // control the phase of all generators
  key('shift+p', function () {
    return _gibberishAudio2['default'].allSynths(function (s) {
      s.phase = 0;
    });
  });

  /* MISC */

  key('shift+s', function () {
    return _state2['default'].saveToURL();
  }); // state -> url

  key('shift+l', function () {
    _gui2['default'].STYLE.drawScanLines = !_gui2['default'].STYLE.drawScanLines;_gui2['default'].updateScanners();
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
    this.id = sampler.id;

    // a little hacky, but this is what Gibberish gives us
    var sequencer = new Gibberish.Sequencer({
      target: sampler, // attach to the sampler,
      key: 'ontick', // ... and invoke its ontick method
      durations: [100], // ... every this many samples
      values: [function () {
        return function () {
          _state2['default'].load(sampler.id).phase = sampler.getPhase();
        };
      }], // ... with a function that returns a function which the ontick method will invoke
      shouldKeepOffset: true //TODO should i keep this?
    });

    this.sequencer = sequencer;
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
      if (!this.sequencer.isRunning) this.sequencer.start();
    },
    get: function get() {
      return [this.sampler.getBuffer(), this.sampler.getBuffer()];
    }
  }, {
    key: 'pitch',
    set: function set(pitch) {
      this.sampler.pitch = pitch;
      _state2['default'].load(this.id).pitch = this.sampler.pitch;
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

function loadSynthParamsFromState() {
  var ids = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
  var params = arguments.length <= 1 || arguments[1] === undefined ? ["amp", "pitch", "phase"] : arguments[1];

  ids.map(function (id) {
    var stateI = _state2['default'].load(id),
        synthI = synths[id];

    params.forEach(function (param, i) {
      if (stateI[param]) synthI[param] = _state2['default'][param];
    });
  });
}

function synth(i, fn) {
  fn(synths[i]);
}

function focusedSynth(fn) {
  fn(synths[_state2['default'].focus]);
}

function allSynths(fn) {
  synths.map(function (s, i) {
    return fn(s);
  });
}

function allSynthsButFocused(fn) {
  synths.map(function (s, i) {
    if (s.id != _state2['default'].focus) fn(s);
  });
}

synths = synths.map(function (e, i) {
  return new GibberishSamplerSynth({ id: i });
});

exports['default'] = { synths: synths, loadSynthParamsFromState: loadSynthParamsFromState, focusedSynth: focusedSynth, allSynths: allSynths, allSynthsButFocused: allSynthsButFocused, numSamples: numSamples };
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

var ORIGINAL_STYLE = {
  withColours: true,
  invertColours: false,
  drawAllLevels: true,
  drawScanLines: false
};

var STYLE = {
  withColours: false,
  invertColours: false,
  drawAllLevels: true,
  drawScanLines: true
};

var canvas = document.querySelector('canvas#fractal-layer'),
    ctx = canvas.getContext('2d'),
    scannerCanvas = document.querySelector('canvas#scanner-layer'),
    scannerCtx = scannerCanvas.getContext('2d'),
    segmentH = window.innerHeight / 8;

function dim(i) {
  return { x: 0, y: i * segmentH, w: window.innerWidth - 150, h: segmentH };
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

function updateScanners() {
  if (!STYLE.drawScanLines) return;

  var stateI,
      i = 8;

  //FIXME: because removing just the single mark doesn't work reliably
  scannerCtx.clearRect(0, 0, scannerCanvas.width, scannerCanvas.height);

  while (i--) {
    stateI = _state2['default'].load(i);
    updateScanner(i, stateI);
  }

  requestAnimationFrame(updateScanners);
}

function updateScanner(i, stateI) {
  var dimI = dim(i);

  //FIXME: this skips and misses some of the marks unfortunately -- disabling it, and using the
  //fullscreen clearRect in updateScanners() above
  if (false && stateI.lastphaseOnScreen !== undefined) {
    scannerCtx.clearRect(stateI.lastphaseOnScreen, dimI.y, 1, dimI.h);
  }

  if (stateI.phase !== undefined) {
    // we really shouldn't be doing this here at every update
    var numSamples = Math.pow(stateI.pattern.length, stateI.iterations);
    var phaseOnScreen = Math.round(stateI.phase / numSamples * dimI.w + dimI.x);
    scannerCtx.fillStyle = 'white';
    scannerCtx.fillRect(phaseOnScreen, dimI.y, 1, dimI.h);
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

window.onresize = resizeCanvas;
resizeCanvas();

updateScanners();

exports['default'] = { updateCantor: updateCantor, updateIterations: updateIterations, updateSliders: updateSliders, updateScanners: updateScanners, STYLE: STYLE };
module.exports = exports['default'];
});

require.register("gui/cantor", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function plotIteration(ctx, iteration, dimensions, STYLE) {
  if (typeof iteration === "undefined") return;

  var i = iteration.length,
      segmentW = dimensions.w / i,
      c,
      y;

  if (STYLE.withColours) while (i--) {
    // more fun
    c = Math.round(360 * iteration[i]);
    ctx.fillStyle = "hsl(" + c + ", 60%, 60%)";

    // more accurate
    // c = Math.round(100 * iteration[i]);    
    // ctx.fillStyle = `hsl(12, ${c}%, ${c}%)`;

    y = dimensions.y;
    ctx.fillRect(segmentW * i, y, segmentW, dimensions.h);
  } else while (i--) {
    c = Math.round(255 * iteration[i]);
    if (STYLE.invertColours) c = 255 - c;
    ctx.fillStyle = "rgb(" + c + ", " + c + ", " + c + ")";

    y = dimensions.y;
    ctx.fillRect(segmentW * i, y, segmentW, dimensions.h);
  }
}

function plot(ctx, cantor, dimensions, STYLE) {
  var i = Math.min(cantor.length, 8),
      h = dimensions.h,
      dim;

  if (!STYLE.drawAllLevels) {
    dim = Object.create(dimensions);
    plotIteration(ctx, cantor[i - 1], dim, STYLE);
  } else {
    dimensions.h = h / i;

    while (i--) {
      dim = Object.create(dimensions);
      dim.y = dim.y + dim.h * i;
      dim.level = i;
      plotIteration(ctx, cantor[i - 1], dim, STYLE);
    }
  }
}

exports["default"] = { plot: plot };
module.exports = exports["default"];
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

var _gibberishAudio = require('gibberish-audio');

var _gibberishAudio2 = _interopRequireDefault(_gibberishAudio);

window.player = _player2['default'];
window.play = _player2['default'].play;
window.playDebounced = _player2['default'].playDebounced;

window.initLaunchpad = _controllersLaunchpad2['default'];
window.initLaunchControl = _controllersNovationLaunchcontrol2['default'];
window.initCMDLC1 = _controllersCmdLc12['default'];
window.initKeyboard = _controllersKeyboard2['default'];

(0, _controllersKeyboard2['default'])();

window.availableDevices = _midi.availableDevices;

window.state = _state2['default'];
// window.controls = controls;

// Recreate the instrument state from the URL
if (_state2['default'].loadFromURL()) {

  // initialise (all) the controls from the state
  _controllersCmdLc1Controls2['default'].init();

  // these are the states that have been initialised
  var activeStateIds = _state2['default'].getActiveStateIds();

  // load synth parameters (amp, pitch, phase, etc) from the states
  _gibberishAudio2['default'].loadSynthParamsFromState(activeStateIds);

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

require.register("player", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _gibberishAudio = require('gibberish-audio');

var _gibberishAudio2 = _interopRequireDefault(_gibberishAudio);

var _gui = require('gui');

var _gui2 = _interopRequireDefault(_gui);

var _state = require('state');

var _state2 = _interopRequireDefault(_state);

var debouncedTimeouts = [],
    workers = [];

function updateSynthAndGUI(i, data) {
  var cantor = data.cantor,
      wavetable = cantor[cantor.length - 1];
  _state2['default'].save(i, data);
  _gibberishAudio2['default'].synths[i].wavetable = wavetable;
  _gui2['default'].updateIterations(i, data.iterations);
  _gui2['default'].updateCantor(i, cantor);
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
  _gibberishAudio2['default'].synths[i].togglemute();
}

function volume(i, value, isdelta) {
  var vol = _gibberishAudio2['default'].synths[i].volume;

  if (isdelta) vol = vol + value;else vol = value;

  if (vol < 0.0) vol = 0;
  if (vol > 10.0) vol = 10.0;

  _gibberishAudio2['default'].synths[i].volume = vol;
}

function playRatechange(i, factor) {
  _gibberishAudio2['default'].synths[i].playRatechange(factor);
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
  return state[i] || { iterations: 7, pattern: [0.5, 0.5, 0.5, 0.5], phase: undefined, lastphaseOnScreen: undefined };
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


//# sourceMappingURL=main.js.map