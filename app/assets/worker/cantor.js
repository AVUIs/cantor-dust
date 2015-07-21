'use strict';

// 1.0
// 1.0         0.5          1.0
// 1.0 0.5 1.0 0.5 0.25 0.5 1.0 0.5 1.0

function mult(arr, n) {
  return arr.map(function(x) { return x * n; });
}

function vecMult(xs, ys) {
  return xs.reduce(function(acc, x) {
    return acc.concat(mult(ys, x));
  }, []);
}

function cantor(pattern, iterations, maxLength) {
  var arr = [1],
      maxSeedLen;
  pattern    = pattern || [1, 0.5, 1];
  iterations = iterations || 10;
  maxLength  = maxLength || Math.pow(2, 19);
  maxSeedLen = Math.ceil(maxLength / pattern.length);

  while (iterations--) {
    arr = arr.slice(0, maxSeedLen);
    arr = vecMult(pattern, arr);
  }
  return arr;
}

onmessage = function(args) {
  var pattern    = args.data[0] || [0.33,1,0.75,0.5],
      iterations = args.data[1] || 7,
      data       = cantor(pattern, iterations);
  postMessage(data);
  close();
};
