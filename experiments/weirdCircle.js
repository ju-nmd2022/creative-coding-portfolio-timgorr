let osc, playing, freq, amp;
let noiseMax = 1;
let slider;

function setup() {
    let cnv = createCanvas(800, 800);
    slider = createSlider(0, 30, 0, 0.2);
    let sliderLabel = createP('Chaos Range Slider (click on canvas to play sound)');
    sliderLabel.position(10,40); 
    sliderLabel.style('font-family', 'Arial');
    sliderLabel.style('font-size', '16px');
    sliderLabel.style('color', '#333');
    cnv.mousePressed(playOscillator);
    osc = new p5.Oscillator('sine');
}

function draw() {
    background(0);
    translate(width / 2, height / 2);
    stroke(255);
    noFill();
    
    noiseMax = slider.value(); 
    
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.05) {
        let xoff = map(cos(a), -1, 1, 0, noiseMax);
        let yoff = map(sin(a), -1, 1, 0, noiseMax);
        let r = map(noise(xoff, yoff), 0, 1, 50, 350);
        let x = r * cos(a);
        let y = r * sin(a);
        vertex(x, y);
        
        if (playing) {
          
            freq = map(r, 50, 350, 100, 1000);  
            osc.freq(freq, 0.1); 
            osc.amp(0.5, 0.1);    
        }
    }
    endShape(CLOSE);
}

function playOscillator() {
    osc.start();
    playing = true;
}

function mouseReleased() {
    osc.amp(0, 0.5);
    playing = false;
}
