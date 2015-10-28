'use strict';

function plotIteration(ctx, iteration, dimensions, withcolours) {
  var i = iteration.length,
      segmentW = dimensions.w / i,
      c, y;
  while (i--) {
    if (withcolours) {
      c = Math.round(360 * iteration[i]); 
      ctx.fillStyle = `hsl(${c}, 60%, 60%)`; 
    }
    else {
      c = Math.round(255 * iteration[i]);
      ctx.fillStyle = `rgb(${c}, ${c}, ${c})`;
    }
    
    y = dimensions.y;

    ctx.fillRect(segmentW * i, y, segmentW, dimensions.h);
  }
}

function plot(ctx, cantor, dimensions, withcolours) {
  var i = Math.min(cantor.length, 8),
      h = dimensions.h,
      dim;
  dimensions.h = h / i;
  while (i--) {
    dim = Object.create(dimensions);
    dim.y = dim.y + dim.h * i;
    plotIteration(ctx, cantor[i], dim, withcolours);
  }
}

export default { plot };
