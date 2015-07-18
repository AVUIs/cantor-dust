'use strict';

var arr = new Float64Array(8);

// Expected postMessage argument is an array pattern.
//  i.e. [1.0, 0.5, 1.0]
onmessage = function(message, x) {
  postMessage(
    cantor(message.data)
  );
};

// 1.0
// 1.0         0.5          1.0
// 1.0 0.5 1.0 0.5 0.25 0.5 1.0 0.5 1.0

function cantor(pattern, iterations) {
  var arr = [1];
  pattern    = pattern || [1, 0.5, 1];
  iterations = iterations || 5;

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
