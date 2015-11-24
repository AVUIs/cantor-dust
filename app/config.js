'use strict'

var params = {
  VISUALS: {
    STYLE: {
      withColours: true,
      invertColours: false,
      drawAllLevels: true,
      drawLevelsTopDown: false,
    },
    drawScanLines: false,
    FPS: 40
  },

  AUDIO: {
    resetPhaseOnNewBuffer: false
  }
}

var original = {
  VISUALS: {
    STYLE: {
      withColours: false,
      invertColours: false,
      drawAllLevels: true,
      drawLevelsTopDown: true,
    },
    drawScanLines: false,
    FPS: 60
  },

  AUDIO: {
    resetPhaseOnNewBuffer: true
  }
}

export default { params };
