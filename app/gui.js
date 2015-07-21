'use strict';

var Interface = Interface;

var a = new Interface.Panel({
  useRelativeSizesAndPositions: true,
  container:document.querySelector('#fract-synth-1 .controls')
});

var xy = new Interface.XY({
  childWidth: 50,
  numChildren: 6,
  background:'#111',
  target: 'OSC',
  key: '/xy',
  fill: 'rgba(127,127,127,.2)',
  bounds:[0, 0, 0.6, 1],
  usePhysics: true,
  detectCollisions: false,
  oninit: function() {
    this.rainbow();
    this.sendValues();
  },
});

var c = new Interface.Slider({
  bounds:[0.65, 0, 0.15, 1],
  min: 0,
  max: 0.25,
  value: 0.125,
  fill:'#333',
  background:'#111',
  label:'friction',
  onvaluechange: function() {
    this.value = 1 - this.value;
    console.log('friction: ' + this.value);
  },
});
var d = new Interface.Slider({
  bounds:[0.825, 0, 0.15, 1],
  target:xy, key:'maxVelocity',
  min :0.5,
  max: 20,
  value: 15,
  fill: '#333',
  background: '#111',
  label:'velocity',
});

a.background = 'black';
a.add(c, d);

export default { gui: 123 };
