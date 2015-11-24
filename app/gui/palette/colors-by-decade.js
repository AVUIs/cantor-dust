'use strict';

import * as Utils from 'utils';

function transform_to_hsl(palette) {
  var transformed = {};

  Object.keys(palette).forEach( (decade) => {
    var colours = palette[decade];
    transformed[decade]
      = colours.map( (hsb) => { return Utils.hsv_to_hsl(360*hsb["hue"], hsb["saturation"], hsb["brightness"]) } );
  });

  return transformed;
}


var palette = {
  "1900s" : [
      {
        "hue" : 0.08333328,
        "saturation" : 0.2089552,
        "brightness" : 0.5254902
      },
      {
        "hue" : 0.1388889,
        "saturation" : 0.6875,
        "brightness" : 0.3764706
      },
      {
        "hue" : 0.1203704,
        "saturation" : 0.07792208,
        "brightness" : 0.9058824
      },
      {
        "hue" : 0.07246377,
        "saturation" : 0.1949152,
        "brightness" : 0.9254902
      },
      {
        "hue" : 0.06578946,
        "saturation" : 0.6867469,
        "brightness" : 0.6509804
      },
      {
        "hue" : 0.02927928,
        "saturation" : 0.4134078,
        "brightness" : 0.7019608
      },
      {
        "hue" : 0.517284,
        "saturation" : 1,
        "brightness" : 0.5294118
      },
      {
        "hue" : 0.3695652,
        "saturation" : 0.184,
        "brightness" : 0.4901961
      }
  ],
  "1910s" : [
      {
        "hue" : 0.1090225,
        "saturation" : 0.7916666,
        "brightness" : 0.6588235
      },
      {
        "hue" : 0.1512346,
        "saturation" : 0.2432432,
        "brightness" : 0.8705882
      },
      {
        "hue" : 0.1111111,
        "saturation" : 0.6195652,
        "brightness" : 0.3607843
      },
      {
        "hue" : 0.6780303,
        "saturation" : 0.34375,
        "brightness" : 0.5019608
      },
      {
        "hue" : 0.5407125,
        "saturation" : 1,
        "brightness" : 0.5137255
      },
      {
        "hue" : 0.2142857,
        "saturation" : 0.4336283,
        "brightness" : 0.4431373
      },
      {
        "hue" : 0.02141528,
        "saturation" : 0.7920354,
        "brightness" : 0.8862745
      },
      {
        "hue" : 0.5498084,
        "saturation" : 1,
        "brightness" : 0.3411765
      }
    ],
    "1920s" : [
      {
        "hue" : 0.07407407,
        "saturation" : 0.04736842,
        "brightness" : 0.7450981
      },
      {
        "hue" : 0.03030304,
        "saturation" : 0.34375,
        "brightness" : 0.3764706
      },
      {
        "hue" : 0.04964538,
        "saturation" : 0.5026738,
        "brightness" : 0.7333333
      },
      {
        "hue" : 0.9785478,
        "saturation" : 0.4879227,
        "brightness" : 0.8117647
      },
      {
        "hue" : 0.1134752,
        "saturation" : 0.5053763,
        "brightness" : 0.7294118
      },
      {
        "hue" : 0.25,
        "saturation" : 0.2368421,
        "brightness" : 0.5960785
      },
      {
        "hue" : 0.5729167,
        "saturation" : 0.6829268,
        "brightness" : 0.6431373
      },
      {
        "hue" : 0.9583333,
        "saturation" : 0.1142858,
        "brightness" : 0.1372549
      }
    ],
  "1930s" : [
      {
        "hue" : 0.5855856,
        "saturation" : 0.578125,
        "brightness" : 0.2509804
      },
      {
        "hue" : 0.1267056,
        "saturation" : 0.6705883,
        "brightness" : 1
      },
      {
        "hue" : 0.1195652,
        "saturation" : 0.9055118,
        "brightness" : 0.9960784
      },
      {
        "hue" : 0.9869685,
        "saturation" : 1,
        "brightness" : 0.9529412
      },
      {
        "hue" : 0.06814449,
        "saturation" : 0.8319672,
        "brightness" : 0.9568627
      },
      {
        "hue" : 0.4112903,
        "saturation" : 1,
        "brightness" : 0.4862745
      },
      {
        "hue" : 0.1111111,
        "saturation" : 0.6195652,
        "brightness" : 0.3607843
      },
      {
        "hue" : 0.7424242,
        "saturation" : 0.5,
        "brightness" : 0.5176471
      }
  ],
  "1940s" : [
      {
        "hue" : 0.4147727,
        "saturation" : 1,
        "brightness" : 0.6901961
      },
      {
        "hue" : 0.550505,
        "saturation" : 0.45,
        "brightness" : 0.8627451
      },
      {
        "hue" : 0.1529126,
        "saturation" : 0.8547718,
        "brightness" : 0.945098
      },
      {
        "hue" : 0.9866667,
        "saturation" : 0.952381,
        "brightness" : 0.8235294
      },
      {
        "hue" : 0.06696429,
        "saturation" : 0.4462151,
        "brightness" : 0.9843137
      },
      {
        "hue" : 0.4009662,
        "saturation" : 0.3382353,
        "brightness" : 0.8
      },
      {
        "hue" : 0.1349206,
        "saturation" : 0.1666667,
        "brightness" : 0.9882353
      },
      {
        "hue" : 0.06060606,
        "saturation" : 0.1973094,
        "brightness" : 0.8745098
      }
  ],
  "1950s" : [
      {
        "hue" : 0.1315359,
        "saturation" : 0.8395061,
        "brightness" : 0.9529412
      },
      {
        "hue" : 0.08553794,
        "saturation" : 0.7590362,
        "brightness" : 0.9764706
      },
      {
        "hue" : 0.1880631,
        "saturation" : 0.7668394,
        "brightness" : 0.7568628
      },
      {
        "hue" : 0.5,
        "saturation" : 0.03305785,
        "brightness" : 0.9490196
      },
      {
        "hue" : 0.5793651,
        "saturation" : 0.1858407,
        "brightness" : 0.4431373
      },
      {
        "hue" : 0.7192982,
        "saturation" : 0.3220339,
        "brightness" : 0.2313726
      },
      {
        "hue" : 0.4791667,
        "saturation" : 0.1818182,
        "brightness" : 0.6901961
      },
      {
        "hue" : 0.9866667,
        "saturation" : 0.09803921,
        "brightness" : 1
      },
      {
        "hue" : 0.5050505,
        "saturation" : 0.1563981,
        "brightness" : 0.827451
      },
      {
        "hue" : 0.1349206,
        "saturation" : 0.1666667,
        "brightness" : 0.9882353
      },
      {
        "hue" : 0.5815603,
        "saturation" : 0.2034632,
        "brightness" : 0.9058824
      },
      {
        "hue" : 0.07861635,
        "saturation" : 0.2086614,
        "brightness" : 0.9960784
      },
      {
        "hue" : 0.7878788,
        "saturation" : 0.04526749,
        "brightness" : 0.9529412
      },
      {
        "hue" : 0.9467593,
        "saturation" : 0.3333333,
        "brightness" : 0.8470588
      }
  ],
  "1960s" : [
      {
        "hue" : 0.1858974,
        "saturation" : 0.751445,
        "brightness" : 0.6784314
      },
      {
        "hue" : 0.1581699,
        "saturation" : 1,
        "brightness" : 1
      },
      {
        "hue" : 0.9645594,
        "saturation" : 0.9942857,
        "brightness" : 0.6862745
      },
      {
        "hue" : 0.07962963,
        "saturation" : 0.8035714,
        "brightness" : 0.8784314
      },
      {
        "hue" : 0.5673289,
        "saturation" : 1,
        "brightness" : 0.5921569
      },
      {
        "hue" : 0.9171123,
        "saturation" : 0.8461539,
        "brightness" : 0.8666667
      },
      {
        "hue" : 0.1645833,
        "saturation" : 0.8163264,
        "brightness" : 0.7686275
      },
      {
        "hue" : 0.7424242,
        "saturation" : 0.5,
        "brightness" : 0.5176471
      }
  ],
  "1970s" : [
      {
        "hue" : 0.5626667,
        "saturation" : 1,
        "brightness" : 0.4901961
      },
      {
        "hue" : 0.1818182,
        "saturation" : 0.2699386,
        "brightness" : 0.6392157
      },
      {
        "hue" : 0.1134752,
        "saturation" : 0.5053763,
        "brightness" : 0.7294118
      },
      {
        "hue" : 0.03030304,
        "saturation" : 0.34375,
        "brightness" : 0.3764706
      },
      {
        "hue" : 0.9862259,
        "saturation" : 0.7117647,
        "brightness" : 0.6666667
      },
      {
        "hue" : 0.08280256,
        "saturation" : 0.7548077,
        "brightness" : 0.8156863
      },
      {
        "hue" : 0.1309524,
        "saturation" : 0.7909604,
        "brightness" : 0.6941177
      },
      {
        "hue" : 0.1645022,
        "saturation" : 0.6637931,
        "brightness" : 0.454902
      }
  ],
  "1980s" : [
      {
        "hue" : 0.1742919,
        "saturation" : 0.7927461,
        "brightness" : 0.7568628
      },
      {
        "hue" : 0.5454546,
        "saturation" : 0.8571429,
        "brightness" : 0.9058824
      },
      {
        "hue" : 0.7342995,
        "saturation" : 0.3942857,
        "brightness" : 0.6862745
      },
      {
        "hue" : 0.9731182,
        "saturation" : 0.5123967,
        "brightness" : 0.9490196
      },
      {
        "hue" : 0.8651685,
        "saturation" : 0.4917127,
        "brightness" : 0.7098039
      },
      {
        "hue" : 0.4444444,
        "saturation" : 0.01463415,
        "brightness" : 0.8039216
      },
      {
        "hue" : 0.5749441,
        "saturation" : 1,
        "brightness" : 0.5843138
      },
      {
        "hue" : 0.9583333,
        "saturation" : 0.1142858,
        "brightness" : 0.1372549
      }
    ],
  "1990s" : [
      {
        "hue" : 0.1527778,
        "saturation" : 0.3348837,
        "brightness" : 0.8431373
      },
      {
        "hue" : 0.3937198,
        "saturation" : 0.4539474,
        "brightness" : 0.5960785
      },
      {
        "hue" : 0.2314815,
        "saturation" : 0.1978022,
        "brightness" : 0.7137255
      },
      {
        "hue" : 0.5447155,
        "saturation" : 0.1889401,
        "brightness" : 0.8509804
      },
      {
        "hue" : 0.5,
        "saturation" : 0.03305785,
        "brightness" : 0.9490196
      },
      {
        "hue" : 0.6238095,
        "saturation" : 0.3333333,
        "brightness" : 0.8235294
      },
      {
        "hue" : 0.9012821,
        "saturation" : 0.6666666,
        "brightness" : 0.7647059
      },
      {
        "hue" : 0.8282828,
        "saturation" : 0.5,
        "brightness" : 0.5176471
      }
  ],

  "2000s" : [
      {
        "hue" : 0.9791667,
        "saturation" : 0.75,
        "brightness" : 0.5019608
      },
      {
        "hue" : 0.06578946,
        "saturation" : 0.6867469,
        "brightness" : 0.6509804
      },
      {
        "hue" : 0.5498084,
        "saturation" : 1,
        "brightness" : 0.3411765
      },
      {
        "hue" : 0.1587302,
        "saturation" : 0.42,
        "brightness" : 0.1960784
      },
      {
        "hue" : 0.9944071,
        "saturation" : 0.8232045,
        "brightness" : 0.7098039
      },
      {
        "hue" : 0.5442891,
        "saturation" : 1,
        "brightness" : 0.5607843
      },
      {
        "hue" : 0.1563218,
        "saturation" : 0.8238636,
        "brightness" : 0.6901961
      },
      {
        "hue" : 0.1134752,
        "saturation" : 0.5053763,
        "brightness" : 0.7294118
      }
  ]
}

var palette = transform_to_hsl(palette);

export default { palette };
