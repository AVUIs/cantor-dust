'use strict';

// http://stackoverflow.com/questions/3423214/convert-hsb-hsv-color-to-hsl
export function hsv_to_hsl(h, s, v, asPercentages = true) {
    // both hsv and hsl values are in [0, 1]
    var l = (2 - s) * v / 2;

    if (l != 0) {
        if (l == 1) {
            s = 0
        } else if (l < 0.5) {
            s = s * v / (l * 2)
        } else {
            s = s * v / (2 - l * 2)
        }
    }

  if (asPercentages)
    return [h, s*100, l*100];
  else    
    return [h, s, l];
}


export function makeCircularGenerator(array){
  var nextIndex = 0;
  return function() {
    return array[nextIndex++%array.length];
  }
 
}


//export default { hsv_to_hsl };
