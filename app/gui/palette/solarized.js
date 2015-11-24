'use strict';

import * as Utils from 'utils';

var palette =
    [[45,100,71], //yellow
     [18,89,80],  //orange
     [1,79,86],   //red
     [331,74,83], //magenta
     [237,45,77], //violet
     [205,82,82], //blue
     [175,74,63], //cyan
     [68,100,60]  //green
    ];

palette = palette.map( (hsv) => { return Utils.hsv_to_hsl(hsv[0],hsv[1]/100,hsv[2]/100); } );

export default { palette };
