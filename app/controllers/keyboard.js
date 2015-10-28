import controls   from 'controllers/cmd-lc1/controls';
import gui    from 'gui';
import state    from 'state';
import player from 'player';

//window.onkeypress = function(e) { alert(e); console.log(e);}

//window.addEventListener("keypress", function (e) {alert(e);console.log(e);}, true);

function initKeyboard() {

  controls.init();
  
  // Focus on a generator
  key('1', function() { controls.setFocus(0); });
  key('2', function() { controls.setFocus(1); });
  key('3', function() { controls.setFocus(2); });
  key('4', function() { controls.setFocus(3); });
  key('5', function() { controls.setFocus(4); });
  key('6', function() { controls.setFocus(5); });
  key('7', function() { controls.setFocus(6); });
  key('8', function() { controls.setFocus(7); }); 

  // or move the focus with the arrow keys  
  key('up', function() { controls.setFocus((state.focus - 1 + 8)  % 8); });
  key('down', function() { controls.setFocus((state.focus + 1) % 8); });

  
  // increase/decrease the first slider
  key('q', function() { adjustPatternAndUpdateSliders(0, 1); } );
  key('a', function() { adjustPatternAndUpdateSliders(0, -1); });

  // increase/decrease the second slider
  key('w', function() { adjustPatternAndUpdateSliders(1, 1); } );
  key('s', function() { adjustPatternAndUpdateSliders(1, -1); });

  // increase/decrease the third slider
  key('e', function() { adjustPatternAndUpdateSliders(2, 1); } );
  key('d', function() { adjustPatternAndUpdateSliders(2, -1); });

  // increase/decrease the forth slider
  key('r', function() { adjustPatternAndUpdateSliders(3, 1); } );
  key('f', function() { adjustPatternAndUpdateSliders(3, -1); });

  // copy the state & sliders of the focused the generator
  key('c', function() { state.copytobuffer(state.focus); });

  // paste the copied state & slider settings into the newly focused generator
  key('v', function() { var saved = state.savefrombuffer(state.focus);
			if (!saved) return;
			controls.save(state.focus, saved);
			adjustPatternAndUpdateSliders(state.focus, /*force-redraw*/0 );});

  key('x', function() { controls.resetFocusedPattern(); } );

  key('[', function() { controls.setIterations(-1, /*isdelta*/true); controls.restartFocused();});
  key(']', function() { controls.setIterations(1,  /*isdelta*/true); controls.restartFocused();});


  key('-', function() { player.volume(state.focus, -0.1, true); });
  key('=', function() { player.volume(state.focus, 0.1, true); });
  key('0', function() { player.togglemute(state.focus); });

  key('i', function() { controls.invertFocusedPattern(); } );
  
}


function adjustPatternAndUpdateSliders (index,change) {
  var [focused, pattern] = controls.adjustPattern({encoder: index, change: change});
  gui.updateSliders(focused, pattern);
  return [focused, pattern];
}

export default initKeyboard;
