var inc = 0.1;
var scl = 1000;
var cols, rows;

var zoff = 0;

var fr;

var particles = [];

var flowfield;

// scale from the internet
let pentatonicScale = ["E", "G", "A", "B", "D"]; 
let gridSize = 8; 
let gridWidth, gridHeight;
let activeNotes = {}; 
let synth; 

function setup() {
  createCanvas(innerWidth, innerHeight);
  cols = floor(width / scl);
  rows = floor(height / scl);
  fr = createP('');

  flowfield = new Array(cols * rows);

 
  for (var i = 0; i < 1; i++) {
    particles[i] = new Particle();
  }

  
  // garrits synth settings edited
  const vol = new Tone.Volume(-12).toDestination(); 


  const filter = new Tone.Filter({
    frequency: 1400,
    rolloff: -12,
  }).connect(vol);


  
  const chorusVol = new Tone.Volume(-10).toDestination();
  const chorus = new Tone.Chorus(4, 2.5, 0.5).connect(chorusVol).start();
  const chorusFilter = new Tone.Filter({
    frequency: 1100,
    rolloff: -12,
  }).connect(chorus);


  const options = {
    oscillator: {
      type: "sine", 
    },
    envelope: {
      attack: 0.5,
      decay: 0.1,
      sustain: 0.3,
      release: 1,
    },
  };


  synth = new Tone.PolySynth(Tone.Synth, options)
    .connect(filter)
    .connect(chorusFilter);

 
  gridWidth = width / gridSize;
  gridHeight = height / gridSize;

  background(0);
  noLoop(); 
}


function mousePressed() {
  Tone.start().then(() => {
    loop();
  })
}

function draw() {
  background(0); 
  drawGrid(); 
  var yoff = 0;
  for (var y = 0; y < rows; y++) {
    var xoff = 0;
    for (var x = 0; x < cols; x++) {
      var index = x + y * cols;
      var angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
      var v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      flowfield[index] = v;
      xoff += inc;
    }
    yoff += inc;
    zoff += 0.0003;
  }

  for (var i = 0; i < particles.length; i++) {
    particles[i].follow(flowfield);
    particles[i].update();
    particles[i].edges();
    particles[i].show();
    checkGridCollision(particles[i]);
  }

  if (frameCount % 1600 == 0) {
    noLoop();
  }
}


function drawGrid() {
  stroke(150); 
  strokeWeight(1); 
  for (let x = 0; x <= width; x += gridWidth) {
    line(x, 0, x, height); 
  }
  for (let y = 0; y <= height; y += gridHeight) {
    line(0, y, width, y); 
  }
}

// barney codes edited edited parametres
class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxspeed = 6;
    this.prevPos = this.pos.copy();
    this.currentNote = null;
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  } 

  // editedfor extra vectors and mouse following
  follow(vectors) {
    let mouse = createVector(mouseX, mouseY);
    let dir = p5.Vector.sub(mouse, this.pos);
    let vek1 = createVector(innerWidth / 2,innerHeight / 2);
    let dir1 = p5.Vector.sub(vek1, this.pos);
    dir.setMag(0.2);
    dir1.setMag(0.2);
    this.applyForce(dir);
    this.applyForce(dir1);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  show() {
    stroke(255);
    strokeWeight(3);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    this.updatePrev();
  }

  updatePrev() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  edges() {
    if (this.pos.x > width) {
      this.pos.x = 0;
      this.updatePrev();
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
      this.updatePrev();
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
      this.updatePrev();
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
      this.updatePrev();
    }
  }
}

// chatgpt help
function checkGridCollision(particle) {
  let gridX = floor(particle.pos.x / gridWidth);
  let gridY = floor(particle.pos.y / gridHeight);


  if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < pentatonicScale.length) {
    let note = pentatonicScale[gridY % pentatonicScale.length];
    let noteWithOctave = `${note}4`;
    
    if (particle.currentNote !== noteWithOctave) {
 
      if (particle.currentNote) {
        stopNote(particle.currentNote); 
      }
      playContinuousNote(noteWithOctave); 
      particle.currentNote = noteWithOctave; 
    }
  } else {
    if (particle.currentNote) {
      stopNote(particle.currentNote);
      particle.currentNote = null;
    }
  }
}

function playContinuousNote(note) {
  synth.triggerAttack(note);
}

function stopNote(note) {
  synth.triggerRelease(note);
}
