"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

let img;
function p3_preload() {
  // image from pexels
  // https://www.pexels.com/search/space/
  img = loadImage(
    "https://cdn.glitch.global/0c34114b-917e-4a91-858c-bfc0578827c9/pexels-francesco-ungaro-998641.jpg?v=1745989355386"
  );
}

function p3_setup() {}

let worldSeed;
let s = 0;
let toChange = [];

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 32;
}
function p3_tileHeight() {
  return 24;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1;
}

function p3_drawBefore() {
  image(img, 0, 0);
  // make the tiles glow
  drawingContext.shadowBlur = 32;
  drawingContext.shadowColor = color(207, 7, 99);
}

function p3_drawTile(i, j) {
  noStroke();

  if (XXH.h32("tile:" + [i, j], worldSeed) % 4 == 0) {
    fill(255, 255, 0);
  } else if (XXH.h32("tile:" + [i, j], worldSeed) % 5 == 0) {
    fill(0, 255, 255);
  } else if (XXH.h32("tile:" + [i, j], worldSeed) % 6 == 0) {
    fill(255, 0, 0);
  } else if (XXH.h32("tile:" + [i, j], worldSeed) % 7 == 0) {
    fill(0, 255, 0);
  } else if (XXH.h32("tile:" + [i, j], worldSeed) % 9 == 0) {
    fill(0, 0, 255);
  } else {
    fill(255, 0, 255);
  }

  push();

  beginShape();
  vertex(-tw * noise(2), 0);
  vertex(0, th * noise(2));
  vertex(tw * noise(2), 0);
  vertex(0, -th * noise(2));
  endShape(CLOSE);

  let n = clicks[[i, j]] | 0;
  if (n < 0) {
    clicks[[i, j]] = 0;
  } else if (n == 1) {
    fill(random(255), random(255), random(255), 255);
    stroke(0, 0, 0, 255);
    beginShape();
    vertex(-tw * noise(2), 0);
    vertex(0, th * noise(2));
    vertex(tw * noise(2), 0);
    vertex(0, -th * noise(2));
    endShape(CLOSE);

    clicks[[i, j]] = -1;
    let a = clicks[[i - 1, j]] | 0;
    let b = clicks[[i, j - 1]] | 0;
    let c = clicks[[i + 1][j]] | 0;
    let d = clicks[[i][j + 1]] | 0;
    if (a >= 0) toChange.push([i - 1, j]);
    if (b >= 0) toChange.push([i, j - 1]);
    if (c >= 0) toChange.push([i + 1, j]);
    if (d >= 0) toChange.push([i, j + 1]);

    if (a != -1 && b != -1 && c != -1 && d != -1 && clicks[[i, j]] <= -1) {
      clicks[[i - 1, j]] = 2;
      clicks[[i, j - 1]] = 2;
    }
  } else if (n == 2) {
    fill(random(255), random(255), random(255), 255);
    stroke(0, 0, 0, 255);
    beginShape();
    vertex(-tw * noise(2), 0);
    vertex(0, th * noise(2));
    vertex(tw * noise(2), 0);
    vertex(0, -th * noise(2));
    endShape(CLOSE);
    clicks[[i, j]] = -1;
  }

  pop();
}

function p3_drawSelectedTile(i, j) {
  fill(255, 255, 255, 255);

  stroke(0, 0, 0, 255);

  beginShape();
  vertex(-tw * noise(2), 0);
  vertex(0, th * noise(2));
  vertex(tw * noise(2), 0);
  vertex(0, -th * noise(2));
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {
  let change = 1; // change grid every _ seconds based on this number
  if (millis() / 1000 >= change + s) {
    worldSeed++;
    s = millis() / 1000;
  }
  for (let i = 0; i < toChange.length; i++) {
    let [x, y] = toChange.pop();
    clicks[[x, y]] = 2;
  }
}
