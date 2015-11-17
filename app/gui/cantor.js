'use strict';

function plotIteration(ctx, iteration, dimensions, STYLE) {
  if (typeof iteration === "undefined") return;
  
  var i = iteration.length,
      segmentW = dimensions.w / i,
      c, y;

  if (STYLE.withColours) 
    while (i--) {
      // more fun
      c = Math.round(360 * iteration[i]); 
      ctx.fillStyle = `hsl(${c}, 60%, 60%)`;

      // more accurate
      // c = Math.round(100 * iteration[i]);     
      // ctx.fillStyle = `hsl(12, ${c}%, ${c}%)`;
      
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
