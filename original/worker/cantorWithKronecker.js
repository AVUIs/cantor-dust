'use strict';

// 1.0
// 1.0         0.5          1.0
// 1.0 0.5 1.0 0.5 0.25 0.5 1.0 0.5 1.0

function kroneckerProduct(vec1, vec2) {
  var vec1size = vec1.length,
      vec2size = vec2.length,
      i,j, out = [];

  for(i = 0; i < vec1size; i++) {
    for (j = 0; j < vec2size; j++) {
      out[i*vec2size+j] = vec1[i] * vec2[j];
    }
  }
  return out;  
}



function cantorWithKronecker(pat, iterations) {
  var results = [],
      arr     = [1],
      maxLen  = Math.pow(2, 19),
      maxSeedLen;
  iterations = iterations || 10;
  maxSeedLen = Math.ceil(maxLen / pat.length);

  while (iterations--) {
    arr = arr.slice(0, maxSeedLen);
    arr = kroneckerProduct(pat, arr);
    results.push(arr.slice(0, maxLen));
  }
  return results;
}


onmessage = function(args) {
  var pattern    = args.data[0] || [0.33,1,0.75,0.5],
      iterations = args.data[1] || 7,
      data       = cantorWithKronecker(pattern, iterations);
  postMessage(data);
  close();
};

