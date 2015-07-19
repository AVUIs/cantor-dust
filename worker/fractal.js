'use strict';

onmessage = function(args) {
  var pattern    = args.data[0] || [0.33,1,0.75,0.5],
      iterations = args.data[1] || 7,
      data       = cantor(pattern, iterations);
  postMessage(data);
  close();
};

// 1.0
// 1.0         0.5          1.0
// 1.0 0.5 1.0 0.5 0.25 0.5 1.0 0.5 1.0

function cantor(pattern, iterations) {
  var arr = [1];
  pattern    = pattern || [1, 0.5, 1];
  iterations = iterations || 10;

  while (iterations--) {
      arr = vecMult(pattern, arr);
  }
  return arr;
}


function vecMult(xs, ys) {
  return xs.reduce(function(acc, x) {
    return acc.concat(mult(ys, x));
  }, []);
}

function mult(arr, n) {
  return arr.map(function(x) { return x * n; });
}
