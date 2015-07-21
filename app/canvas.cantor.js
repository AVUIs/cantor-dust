// http://andrew-hoyer.com/experiments/fractals/source/cantor.js

'use strict';

class Cantor {
  constructor(canvasID,standalone) {
    // initialize the tree.
    this.canvas = new Canvas(this,canvasID);
    this.ctx = this.canvas.ctx;
    this.fillStyle = 'black';

    this.maxOrder = 7;

    this.orderColours = Gradient('#258dc9', '#043342', this.maxOrder);

    this.minGap = 0.03;
    this.maxGap = 0.5;
    this.gap = 0.3;
    this.minWidth = 0.15;
    this.leftWidth = this.rightWidth = (1-this.gap)/2;

    this.baseWidth = this.canvas.width*0.8;
    this.baseOffset = (this.canvas.width - this.baseWidth)/2;
    this.baseHeight = this.canvas.height - (2*this.baseOffset);

    this.barHeight = (2*this.baseHeight)/((3*this.maxOrder)-1);
    this.barOffset = this.barHeight + (0.5*this.barHeight);

    // actually initialize the canvas
    this.draw();
    if (!standalone) {
      this.canvas.blur();
    }
  }

  update(pos) {
    this.canvas.clear();
    this.updateGap(pos);
    this.draw();
  }

  updateGap(pos) {
    var x,y,halfGap;

    y = Math.max(0,  Math.min(1,(pos.y-this.baseOffset)/(this.baseHeight))  );
    this.gap = ((this.maxGap-this.minGap)*y) + this.minGap;

    halfGap = this.gap/2;

    x = Math.max(0,Math.min(1,(pos.x-this.baseOffset)/(this.baseWidth)));

    if(pos.x < this.canvas.halfWidth){
      // we're on the left side.
      this.leftWidth = Math.max(this.minWidth,x-halfGap);
      this.rightWidth = 1-this.gap-this.leftWidth;
    }else{
      // we're on the right side.
      this.rightWidth = 1-Math.min(1-this.minWidth,x+halfGap);
      this.leftWidth = 1-this.gap-this.rightWidth;
    }
  }

  draw() {
    this.ctx.save();
    // draw the base bar
    this.ctx.fillStyle = this.orderColours[0];
    this.ctx.translate(this.baseOffset,this.baseOffset);
    this.ctx.fillRect(0,0,this.baseWidth,this.barHeight);
    //			this.drawBars(this.baseWidth,1);
    this.ctx.restore();

  }

  drawBars(prevWidth, order){
    var leftWidth = this.leftWidth*prevWidth,
      midWidth = this.gap*prevWidth,
      rightWidth = this.rightWidth*prevWidth;

    if(order >= this.maxOrder ){
      return;
    }

    this.ctx.fillStyle = this.orderColours[order];
    // draw the left
    this.ctx.save();
    this.ctx.translate(0,this.barOffset);
    this.ctx.fillRect(0,0,leftWidth,this.barHeight);
    this.drawBars(leftWidth,order+1);
    this.ctx.restore();

    // draw the right
    this.ctx.save();
    this.ctx.translate(leftWidth+midWidth,this.barOffset);
    this.ctx.fillRect(0,0,rightWidth,this.barHeight);
    this.drawBars(rightWidth,order+1);
    this.ctx.restore();
  }
}

export default Cantor ;
