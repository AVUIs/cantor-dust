'use strict';

var solarized =
    [[45,100,71], //yellow
     [18,89,80],  //orange
     [1,79,86],   //red
     [331,74,83], //magenta
     [237,45,77], //violet
     [205,82,82], //blue
     [175,74,63], //cyan
     [68,100,60]  //green
    ];

function plotIteration(ctx, iteration, dimensions, STYLE) {
  if (typeof iteration === "undefined") return;
  
  var i = iteration.length,
      segmentW = dimensions.w / i,
      c, y, h,s,l;

  if (STYLE.withColours)
    while (i--) {
      // more fun
      // c = Math.round(360 * iteration[i]);
      // ctx.fillStyle = `hsl(${c}, 60%, 60%)`;

      // more accurate
      // c = Math.round(100 * iteration[i]);     
      // ctx.fillStyle = `hsl(12, ${c}%, ${c}%)`;

      //solarized & accurate (we vary the lightness/brightness of the colours)
      c = Math.round(100 * iteration[i]);
      h = solarized[dimensions.segmentId][0];
      s = solarized[dimensions.segmentId][1];
      ctx.fillStyle = `hsl(${h}, ${s}%, ${c}%)`;

      y = dimensions.y;      
      ctx.fillRect(segmentW * i, y, segmentW, dimensions.h);
    }
  else 
    while (i--) {
      c = Math.round(255 * iteration[i]);
      if (STYLE.invertColours) c = 255-c;
      ctx.fillStyle = `rgb(${c}, ${c}, ${c})`;
          
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
    plotIteration(ctx, cantor[i-1], dim, STYLE);
  }
  else {     
    dimensions.h = h / i;
  
    while (i--) {
      dim = Object.create(dimensions);
      dim.y = dim.y + dim.h * i;
      dim.level = i;
      plotIteration(ctx, cantor[i-1], dim, STYLE);
    }
  }
}

export default { plot };
