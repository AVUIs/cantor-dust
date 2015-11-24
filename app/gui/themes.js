'use strict';

import decades from 'gui/palette/colors-by-decade';
import pantone_coy from 'gui/palette/pantone-color-of-the-year';
import solarized from 'gui/palette/solarized';

import {makeCircularGenerator} from 'utils';

var palettes = {
  "solarized": solarized.palette,
  "pantone 2008-2015" : pantone_coy.palette
};
Object.assign(palettes, decades.palette);


var currentPalette = { name: "solarized", palette: solarized.palette };

var nextPaletteName = makeCircularGenerator(Object.keys(palettes));

function nextPalette() {
  var name = nextPaletteName();
  
  while (name === currentPalette.name)
    name = nextPaletteName();

  currentPalette = { name: name, palette: palettes[name] };
  
  return currentPalette;
}


export default { palettes, nextPalette, currentPalette }; 
