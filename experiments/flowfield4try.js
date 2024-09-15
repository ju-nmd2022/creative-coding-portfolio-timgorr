let inc = 0.1;
let scl = 10;
let cols, rows;

let zoff = 0;

let particles = [];
let flowfield;

let stopMoving = false;

// grid made with gpt after i was exhausted and couldnt do it myself - will try again
const gridSize = 5; 
const cellSize = 200; 

function setup() {
  createCanvas(gridSize * cellSize, gridSize * cellSize);
  cols = floor(cellSize / scl);
  rows = floor(cellSize / scl);

  flowfield = new Array(cols * rows * gridSize * gridSize);

  
  for (let gx = 0; gx < gridSize; gx++) {
    for (let gy = 0; gy < gridSize; gy++) {
      for (let i = 0; i < 30; i++) { 
        particles.push(new Particle(gx * cellSize, gy * cellSize));
      }
    }
  }
  background(0);
}

function draw() {
  var yoff = 0;
  if (!stopMoving) {
    for (let gy = 0; gy < gridSize; gy++) {
      for (let gx = 0; gx < gridSize; gx++) {
        for (let y = 0; y < rows; y++) {
          let xoff = 0;
          for (let x = 0; x < cols; x++) {
            let index = x + y * cols + (gx + gy * gridSize) * cols * rows;
            let angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
            let v = p5.Vector.fromAngle(angle);
            v.setMag(1);
            flowfield[index] = v;
            xoff += inc;
          }
          yoff += inc;
          zoff += 0.0003;
        }
      }
    }

    if (frameCount % 1000 == 0) {
      stopMoving = true;
      noLoop();
    }

    
    for (let i = 0; i < particles.length; i++) {
      particles[i].follow(flowfield);
      particles[i].update();
      particles[i].edges();
      particles[i].show();
    }
  }
}

class Particle {
  constructor(offsetX, offsetY) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.pos = createVector(random(offsetX, offsetX + cellSize), random(offsetY, offsetY + cellSize));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxspeed = 2;
    this.prevPos = this.pos.copy();
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  follow(vectors) {
    let x = floor((this.pos.x - this.offsetX) / scl);
    let y = floor((this.pos.y - this.offsetY) / scl);
    let index = x + y * cols + (floor(this.offsetX / cellSize) + floor(this.offsetY / cellSize) * gridSize) * cols * rows;
    let force = vectors[index];
    this.applyForce(force);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  show() {
    stroke(255, 10);
    strokeWeight(1);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    this.updatePrev();
  }

  updatePrev() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  edges() {
    if (this.pos.x > this.offsetX + cellSize) {
      this.pos.x = this.offsetX;
      this.updatePrev();
    }
    if (this.pos.x < this.offsetX) {
      this.pos.x = this.offsetX + cellSize;
      this.updatePrev();
    }
    if (this.pos.y > this.offsetY + cellSize) {
      this.pos.y = this.offsetY;
      this.updatePrev();
    }
    if (this.pos.y < this.offsetY) {
      this.pos.y = this.offsetY + cellSize;
      this.updatePrev();
    }
  }
}
