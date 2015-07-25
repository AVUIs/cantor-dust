'use strict';

function plotIteration(ctx, iteration, dimensions) {
  var i = iteration.length,
      segmentW = dimensions.w / i,
      c, y;
  if (segmentW < 0.3) { return; }
  while (i--) {
    c = Math.round(255 * iteration[i]);
    y = dimensions.y;
    ctx.fillStyle = `rgb(${c}, ${c}, ${c})`;
    ctx.fillRect(segmentW * i, y, segmentW, dimensions.h);
  }
}

function plot(ctx, cantor, dimensions) {
  var i = cantor.length,
      h = dimensions.h,
      dim;
  dimensions.h = h / i;
  while (i--) {
    dim = Object.create(dimensions);
    dim.y = dim.y + dim.h * i;
    plotIteration(ctx, cantor[i], dim);
  }
}

export default { plot };
