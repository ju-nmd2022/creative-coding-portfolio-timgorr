let size = 400;
let squareSize = 30; 
let randomDisplacement = 15; 
let offset = 10; 
let rotationSlider;

function setup() {
  createCanvas(size, size); 
  rotationSlider = createSlider(0, 1, 0, 1);
  rotationSlider.addClass('rotationSlider');
  rotationSlider.position(8, window.innerHeight / 2)
  let sliderLabel = createP('Displacement-Switch');
  sliderLabel.position(10,window.innerHeight / 2); 
  sliderLabel.style('font-family', 'Arial');
  sliderLabel.style('font-size', '16px');
  sliderLabel.style('color', '#333');
  noLoop(); 
}

function createCubes() {
  let rotateMultiplier = rotationSlider.value(); 
  clear(); 
  

  for (let i = squareSize; i <= size - squareSize; i += squareSize) {
    for (let j = squareSize; j <= size - squareSize; j += squareSize) {
      
      let translateAmtX = 0;
      let translateAmtY = 0;
      let rotateAmt = 0;

      if (rotateMultiplier > 0) {
        let plusOrMinus = random() > 0.5 ? -1 : 1;
        rotateAmt = (j / size) * PI / 180 * plusOrMinus * random() * rotateMultiplier;

        plusOrMinus = random() > 0.5 ? -1 : 1;
        translateAmtX = (i / size) * plusOrMinus * random() * randomDisplacement;
        translateAmtY = (j / size) * plusOrMinus * random() * randomDisplacement;
      }

      push(); 
      translate(i + translateAmtX + offset, j + translateAmtY + offset); 
      rotate(rotateAmt); 
      rectMode(CENTER); 
      strokeWeight(2);
      rect(0, 0, squareSize, squareSize); 
      pop(); 
    }
  }
}

function draw() {
  createCubes();
}

function mouseReleased() {
  redraw(); // Redraw when the mouse is released
}
