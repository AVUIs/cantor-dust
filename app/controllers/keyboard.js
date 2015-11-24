import controls   from 'controllers/cmd-lc1/controls';
import gui    from 'gui';
import state  from 'state';
import player from 'player';
import audio from 'audio'
import config from 'config'
import themes from 'gui/themes';

function initKeyboard() {

  controls.init();
  
  // Focus on a generator
  key('1', () => controls.setFocus(0));
  key('2', () => controls.setFocus(1));
  key('3', () => controls.setFocus(2));
  key('4', () => controls.setFocus(3));
  key('5', () => controls.setFocus(4));
  key('6', () => controls.setFocus(5));
  key('7', () => controls.setFocus(6));
  key('8', () => controls.setFocus(7)); 

  // or move the focus with the arrow keys  
  key('up', () => controls.setFocus((state.focus - 1 + 8)  % 8));
  key('down', () => controls.setFocus((state.focus + 1) % 8));

  
  // increase/decrease the first slider
  key('q', () => adjustPatternAndUpdateSliders(0, 1) );
  key('a', () => adjustPatternAndUpdateSliders(0, -1));

  // increase/decrease the second slider
  key('w', () => adjustPatternAndUpdateSliders(1, 1) );
  key('s', () => adjustPatternAndUpdateSliders(1, -1));

  // increase/decrease the third slider
  key('e', () => adjustPatternAndUpdateSliders(2, 1) );
  key('d', () => adjustPatternAndUpdateSliders(2, -1));

  // increase/decrease the forth slider
  key('r', () => adjustPatternAndUpdateSliders(3, 1) );
  key('f', () => adjustPatternAndUpdateSliders(3, -1));

  // increase/decrease the fifth slider
  key('t', () => adjustPatternAndUpdateSliders(4, 1) );
  key('g', () => adjustPatternAndUpdateSliders(4, -1));

  
  // copy the state & sliders of the focused generator
  key('c', () => state.copytobuffer(state.focus));

  // paste the copied state & slider settings into the newly focused generator
  key('v', () => { var saved = state.savefrombuffer(state.focus);
		   if (!saved) return;
		   controls.save(state.focus, saved);
		   audio.loadSynthParamsFromState([state.focus]);
		   adjustPatternAndUpdateSliders(state.focus, /*force-redraw*/0 ) });

  key('x', () => controls.resetFocusedPattern() );

  key('i', () => controls.invertFocusedPattern() );
  
  
  key('[', () => { controls.setIterations(-1, /*isdelta*/true); controls.restartFocused() });
  key(']', () => { controls.setIterations(1,  /*isdelta*/true); controls.restartFocused() });


  /* VOLUME */

  // control the volume of the focused generator
  key('-', () => player.volume(state.focus, -0.1, true));
  key('=', () => player.volume(state.focus, 0.1, true));
  key('0', () => player.togglemute(state.focus));

  // control the volume of all but the focused generator
  key('alt+-', () => audio.allSynthsButFocused( (s) => { player.volume(s.id, -0.1, true); }));
  key('alt+=', () => audio.allSynthsButFocused( (s) => { player.volume(s.id, 0.1, true); }));
  key('alt+0', () => audio.allSynthsButFocused( (s) => { player.togglemute(s.id); }));

  // control the volume of all generators
  key('shift+-', () => audio.allSynths( (s) => { player.volume(s.id, -0.1, true); }));
  key('shift+=', () => audio.allSynths( (s) => { player.volume(s.id, 0.1, true); }));
  key('shift+0', () => audio.allSynths( (s) => { player.togglemute(s.id); }));
  

  /* PITCH (PLAYRATE) */
  
  var PLAYRATE_UP_FACTOR = Math.sqrt(2),
      PLAYRATE_DOWN_FACTOR = 1/PLAYRATE_UP_FACTOR;

  // control the pitch (playrate) of the focused generator
  key(',', () => audio.focusedSynth( (s) => s.playRatechange(PLAYRATE_DOWN_FACTOR)));
  key('.', () => audio.focusedSynth( (s) => s.playRatechange(PLAYRATE_UP_FACTOR)));
  key('m', () => audio.focusedSynth( (s) => { s.pitch = 1/8; } ));

  // control the pitch (playrate) of all but the focused generator
  key('alt+,', () => audio.allSynthsButFocused( (s) => { s.playRatechange(PLAYRATE_DOWN_FACTOR) }));
  key('alt+.', () => audio.allSynthsButFocused( (s) => { s.playRatechange(PLAYRATE_UP_FACTOR) }));
  key('alt+m', () => audio.allSynthsButFocused( (s) => { s.pitch = 1/8; } ));

  // control the pitch (playrate) of all generators
  key('shift+,', () => audio.allSynths( (s) => { s.playRatechange(PLAYRATE_DOWN_FACTOR) }));
  key('shift+.', () => audio.allSynths( (s) => { s.playRatechange(PLAYRATE_UP_FACTOR) }));
  key('shift+m', () => audio.allSynths( (s) => { s.pitch = 1/8; } ));

  
  /* PHASE */

  // control the phase of the focused generator
  key('p', () => audio.focusedSynth( (s) => { s.phase = 0; }));
  
  // control the phase of all but the focused generator
  key('alt+p', () => audio.allSynthsButFocused( (s) => { s.phase = 0; }));
  
  // control the phase of all generators
  key('shift+p', () => audio.allSynths( (s) => { s.phase = 0; }));


  /* MISC */

  key('shift+s', () => state.saveToURL()); // state -> url

  key('shift+l', () => { config.params.VISUALS.drawScanLines = !config.params.VISUALS.drawScanLines; gui.updateScanners() });

  key('shift+\\', () => { themes.currentPalette = themes.nextPalette(); document.title = "Cantor Dust :: " + themes.currentPalette.name; gui.updateAll() } );
  
}


function adjustPatternAndUpdateSliders (index,change) {
  var [focused, pattern] = controls.adjustPattern({encoder: index, change: change});
  gui.updateSliders(focused, pattern);
  return [focused, pattern];
}

export default initKeyboard;
