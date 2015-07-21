var a = new Interface.Panel({
    useRelativeSizesAndPositions: true
    ,container:document.querySelector("#fract-synth-1 .controls")
});

var xy = new Interface.XY({
     childWidth: 50,
     numChildren: 6,
     background:"#111",
     target: "OSC",
     key: "/xy",
     fill: "rgba(127,127,127,.2)",
     bounds:[0,0,.6,1],
     usePhysics: true,
     detectCollisions: false,
     oninit: function() { 
  	 this.rainbow(); 
	 this.sendValues();
     },
});

var c = new Interface.Slider({
    bounds:[.65,0,.15,1],
    min:.0, max:.25,
    value:.125,
    fill:'#333', background:'#111',
    onvaluechange: function() {
	this.value = 1 - this.value;
	console.log("friction: " + this.value)},
    label:'friction',
});
var d = new Interface.Slider({
    bounds:[.825,0,.15,1],
    target:xy, key:'maxVelocity',
    min:.5, max:20,
    value:15,
    fill:'#333', background:'#111',
    label:'velocity',
});

a.background = 'black';
a.add(c,d);

export default { gui: 123 } 
