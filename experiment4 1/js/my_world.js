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

function p3_preload() {}

function p3_setup() {}

let worldSeed;
let s = 0;
const spiral = new Map();
let toChange = [];

class block {
  constructor() {
    this.s = 0;
  }

  getS() {
    return this.s;
  }
  increment() {
    this.s++;
  }
}

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
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  let n = clicks[[i, j]] | 0;
  if (n < 0) {
    clicks[[i, j]] = 0;
  } else if (n == 1) {
    clicks[[i, j]] = -1;

    toChange.push([i - 1, j]);
    toChange.push([i, j - 1]);
    toChange.push([i + 1, j]);
    toChange.push([i, j + 1]);

    toChange.push([i - 1, j - 1]);
    toChange.push([i + 1, j - 1]);
    toChange.push([i + 1, j + 1]);
    toChange.push([i - 1, j + 1]);
  } else if (n >= 3) {
    fill(255);
    stroke(0, 0, 0, 255);
    beginShape();
    vertex(-tw, 0);
    vertex(0, th);
    vertex(tw, 0);
    vertex(0, -th);
    endShape(CLOSE);
    clicks[[i, j]] -= 1;
  }

  pop();
}

function p3_drawSelectedTile(i, j) {
  fill(255, 255, 255, 255);

  stroke(0, 0, 0, 255);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
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
    clicks[[x, y]] = 10;
  }
}
