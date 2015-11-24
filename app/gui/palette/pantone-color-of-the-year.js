// http://blog.eliteemail.com/2013/01/03/pantone-color-of-the-year-2013/
// http://colorizer.org/
var palette = [
  hsl(237.6, 0,296, 0.504), //blue izis, 2008
  hsl(42.3, 0.832, 0.625), //mimosa, 2009
  hsl(173.7, 0.455, 0.496), //turquoise, 2010
  hsl(343, 0.62, 0.576), //honeysuckle, 2011
  hsl(9.4, 0.731, 0.504), //tangerine tango, 2012
  hsl(166.1, 1.0, 0.304), //emerald, 2013
  hsl(310.8, 0.333, 0.541), //radiant orchid, 2014
  hsl(0.9, 0.296, 0.451) //marsala, 2015
];

function hsl(h,s,l) {
  //return { "hue": h, "saturation": s, "lightness": l };
  return [h,s*100,l*100];
}


export default { palette };
