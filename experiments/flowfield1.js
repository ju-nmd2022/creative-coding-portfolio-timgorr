let particles = [];
const num = 400;
let vel = 0.01;
let inc = 0.1;
let stopMoving = false;
const noiseScale = 0.01;

speedLimit = 0.01;

let zoff = 0;

function setup() {
  createCanvas(400, 400);
  for (let i = 0; i < num; i++) {
    let particle = {
      pos: createVector(random(width), random(height)),
      vel: createVector(0, 0),
      acc: createVector(0, 0),
      col: color(random(255), random(255), random(255))
    };
    particles.push(particle);
  }
  // let r = millis() * 50;
  // let g = map(cos(millis() * 0.01), -1, 1, 50, 150);  // Muted green range
  // let b = map(sin(millis() * 0.2), -1, 1, 50, 150);  // Muted blue range
  // stroke(r,g,b, 200);
  blendMode(DIFFERENCE);
  strokeWeight(5 - ( millis() * 100.5));
}

function draw() {
  background(0, 4);
  if (!stopMoving) {
    for (let i = 0; i < num; i++) {
      let p = particles[i];
      stroke(p.col);
      point(p.pos.x, p.pos.y);
      let n = noise(p.pos.x * noiseScale, p.pos.y * noiseScale, zoff);
      let a = TWO_PI * n;
      p.acc = createVector(cos(a), sin(a));
      p.vel.add(p.acc);
      p.pos.add(p.vel);
      p.vel.limit(speedLimit);
      if (!onScreen(p.pos)) {
        p.pos.x = random(width);
        p.pos.y = random(height);
        p.vel.mult(0); 
      }
    }
    zoff += 0.1;
  }
  if (frameCount % 220 == 0) {
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
