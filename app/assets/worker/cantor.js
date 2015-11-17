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

// vec1 x vec2 != vec2 x vec1 !!!
function kroneckerProduct(vec1, vec2, out) {
  var vec1size = vec1.length,
      vec2size = vec2.length,
      i,j,
      out = out || new Array(vec1size*vec2size);

  for(i = 0; i < vec1size; i++) {
    for (j = 0; j < vec2size; j++) {
      out[i*vec2size+j] = vec1[i] * vec2[j];
    }
  }
  return out;  
}


function cantor(pat, iterations) {
  var results = [],
      arr     = [1],
      maxLen  = Math.pow(2, 19),
      maxSeedLen;
  iterations = iterations || 10;
  maxSeedLen = Math.ceil(maxLen / pat.length);

  while (iterations--) {
    if (arr.length > maxSeedLen)
      arr = arr.slice(0, maxSeedLen);
    
    //arr = vecMult(pat, arr);
    arr = kroneckerProduct(arr, pat);
    
    results.push(arr.length <= maxLen ? arr : arr.slice(0, maxLen));
  }
  return results;
}


onmessage = function(args) {
  var pattern    = args.data[0] || [0.33,1,0.75,0.5],
      iterations = args.data[1] || 7,
      data       = cantor(pattern, iterations);
  postMessage(data);
  close();
};
