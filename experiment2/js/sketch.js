// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

let seed = 0;
let canvWidth;
let canvHeight;

let skyColor = "#2e4482";
let mountainColor = "#888c8d";
let cliffColor = "#bebebe";
let grassColor = "#7ec850";
let waterColor = "#034770";
let treeColor = "#059033";

function getCanvDimensions() {
  canvWidth = canvasContainer.width();
  canvHeight = canvasContainer.height();
}

let stars = [];
let trees = [];

class Star {
  constructor() {
    this.x = random(canvWidth);
    this.y = random(canvHeight);
    this.size = random(0.25, 3);
    this.t = random(TWO_PI);
    this.s = 0;
    this.shooting = false;
  }

  draw() {
    fill(255, 255, 255, 205);
    this.t += 0.01;
    let scale = this.size + sin(this.t) * 2;
    ellipse(this.x, this.y, scale, scale);
  }

  shoot() {
    if (this.shooting == true) {
      fill(255);
      let scale = this.size + sin(this.t) * 2;
      this.s += 8;
      ellipse(this.x + this.s, this.y + this.s, scale, scale);
    } else {
      if (Math.floor(Math.random() * 15000) == 69) {
        this.shooting = true;
      }
    }
  }
}

class Tree {
  constructor() {
    this.x1 = random(canvWidth);
    this.y1 = canvHeight / 1.25 + 4;
    this.x3 = this.x1 + Math.random() * 10 + 15;
    this.x2 = Math.floor((this.x1 + this.x3) / 2);
    this.y2 = canvHeight / 1.25 - Math.floor(Math.random() * 10) * 5;
  }
  draw() {
    fill(treeColor);
    triangle(this.x1, this.y1, this.x2, this.y2, this.x3, this.y1);
  }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  // create an instance of the class

  $(window).resize(function () {
    resizeScreen();
  });
  resizeScreen();

  getCanvDimensions();
  createButton("reimagine").mousePressed(() => seed++);

  for (let i = 0; i < 1000; i++) {
    stars[i] = new Star();
  }
  for (let i = 0; i < 100; i++) {
    trees[i] = new Tree();
  }
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  noiseSeed(seed);
  background(skyColor);
  getCanvDimensions();

  fill(255, 255, 255, 150);
  for (let i = 0; i < 1000; i++) {
    stars[i].draw();
    stars[i].shoot();
  }

  let noiseLevel = 350;
  let noiseScale = 0.003; // 0.005 is pretty good

  let nx, nt, y;

  // draw background mountain range
  stroke(mountainColor);
  for (let x = 0; x < canvWidth; x++) {
    nx = noiseScale * x;
    nt = noiseScale;

    y = noiseLevel * noise(nx, nt);
    y *= (x / canvWidth) * 1.25;

    line(x, canvHeight, x, canvHeight * 0.8 - y);
  }

  // draw foreground cliffsides

  noiseLevel = 50;
  noiseScale = 0.004;

  stroke(cliffColor);

  let factor = 0;
  for (let x = 0; x < canvWidth; x++) {
    nx = noiseScale * (x + 50);
    nt = noiseScale;

    y = noiseLevel * noise(nx, nt);

    // start decreasing the value of y to add a slope to the cliffside
    if (x > Math.round(canvWidth / 2) - 100) {
      y *= 1 - (5 * factor) / canvWidth;
      factor++;
    }

    line(x, canvHeight, x, canvHeight * 0.5 - y * 8);
  }

  // draw grass at base of cliff
  fill(grassColor);
  rect(0, Math.round(canvHeight / 1.25), canvWidth, Math.round(canvHeight));

  for (let i = 0; i < 100; i++) {
    trees[i].draw();
  }

  // draw water
  noiseLevel = 25;
  noiseScale = 0.002;

  stroke(waterColor);
  for (let x = 0; x < canvWidth; x++) {
    nx = noiseScale * (x + 200);
    nt = noiseScale + frameCount / 1000;

    y = noiseLevel * noise(nx, nt);
    if (x < Math.round(canvWidth / 4)) {
      y *= 1.25 - x / canvWidth;
    }

    line(x, canvHeight, x, canvHeight - y * 6);
  }

  // add a nighttime filter over image
  fill(19, 24, 98, 167);
  rect(0, 0, canvWidth, Math.round(canvHeight));
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
  // code to run when mouse is pressed
}
