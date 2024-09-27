
let video;
let handpose;
let predictions = [];
let grid = []; // 2D array for the grid
let timer = 5; // Seconds until the next snapshot
let gridSize = 8; // Define the grid size
let notes = ["C", "D", "E", "F", "G", "A", "B"]; // Define note names

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Initialize video capture
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide(); // Hide the video element, display it in the canvas instead

  // Initialize ml5 handpose
  handpose = ml5.handpose(video, () => {
    console.log("Handpose model loaded");
  });
  
  // Listen for new handpose predictions
  handpose.on("predict", (results) => {
    predictions = results;
  });

  // Initialize the grid
  initializeGrid();

  // Setup Tone.js context
  Tone.start();
}

function draw() {
  background(0);
  drawCameraFeed();
  drawGrid();
  drawNotes();
  drawTimer();

  if (timer <= 0) {
    takeSnapshot();
    timer = 5; // Reset timer
  }
  
  // Countdown timer every second
  if (frameCount % 60 == 0 && timer > 0) { // Update every second
    timer--;
  }
}

function drawCameraFeed() {
  // Draw the video feed with transparency
  tint(255, 150); // Add some transparency
  image(video, 0, 0, width, height);
}

function drawGrid() {
  // Draw a transparent grid over the camera feed
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      noFill();
      stroke(255);
      rect(i * (width / gridSize), j * (height / gridSize), width / gridSize, height / gridSize);
    }
  }
}

function drawNotes() {
  // Draw the note names on the side of the grid
  fill(255);
  textSize(24);
  for (let i = 0; i < notes.length; i++) {
    text(notes[i], width / gridSize * i + 20, height - 20);
  }
}

function drawTimer() {
  // Draw the timer on the screen
  fill(255);
  textSize(32);
  text(`Time: ${timer}`, 50, 50);
}

function takeSnapshot() {
  // Loop through predictions to detect hands and activate grid cells
  if (predictions.length > 0) {
    const hand = predictions[0];
    hand.landmarks.forEach((point) => {
      const [x, y] = point;

      // Determine which grid cell the point is over
      const gridX = Math.floor((x / width) * gridSize);
      const gridY = Math.floor((y / height) * gridSize);

      if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
        grid[gridX][gridY] = true; // Activate this cell
      }
    });
  }

  playNotes();
}

function playNotes() {
  // Loop through the grid and play the notes for active cells
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j]) {
        // Play the corresponding note using Tone.js
        let note = notes[i % notes.length]; // Determine the note based on grid position
        let synth = new Tone.Synth().toDestination();
        synth.triggerAttackRelease(note, "8n");
        
        grid[i][j] = false; // Reset the cell after playing
      }
    }
  }
}

function initializeGrid() {
  // Initialize the grid with all false values
  for (let i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = false;
    }
  }
}
