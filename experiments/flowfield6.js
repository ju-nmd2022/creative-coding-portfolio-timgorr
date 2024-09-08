particles = [];
const num = 1000;
let vel = 1;
let inc = 0.1;
let stopMoving = false;
const noiseScale = 0.01;

speedLimit = 1;

let zoff = 0;

function setup() {
  createCanvas(400, 400);
  for (let i = 0; i < num; i++) {
    let particle = {
      pos: createVector(random(width), random(height)),
      vel: createVector(0, 0),
      acc: createVector(0, 0),
    //   col: color(random(255), random(255), random(255))
    };
    particles.push(particle);
  }
  let r = millis();
  let g = map(cos(millis() * 1), -1, 1, 50, 200);  
  let b = map(sin(millis() * 0.2), -1, 1, 50, 150);  
  stroke(r,g,b, 200);
  blendMode(ADD);
  strokeWeight(1 - ( millis() * 100.5));
}

function draw() {
    background(0, 4);
    if (!stopMoving) {
      for (let i = 0; i < num; i++) {
        let p = particles[i];
        
        let angle = noise(p.pos.x * noiseScale, p.pos.y * noiseScale, zoff) * TWO_PI * 4;
        let force = p5.Vector.fromAngle(angle);
        force.setMag(vel);
        
       
        p.acc = force;
        p.vel.add(p.acc);
        p.vel.limit(speedLimit);
        p.pos.add(p.vel);
        
        if (p.pos.x > width) p.pos.x = 0;
        if (p.pos.x < 0) p.pos.x = width;
        if (p.pos.y > height) p.pos.y = 0;
        if (p.pos.y < 0) p.pos.y = height;
        
        // stroke(255);
        point(p.pos.x, p.pos.y);
      }
      zoff += inc;
    }
    if (frameCount % 420 == 0) {
        stopMoving = true;
        noLoop();
      }
  }


function mouseReleased() {
    noiseSeed(millis());
}

function onScreen(v) {
  return (v.x >= 0 && v.x <= width && v.y >= 0 && v.y <= height);
}
