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
let sfx;
let bezosImg;
let blackRockImg;
let muskImg;
let zuckImg;
function p3_preload() {
  // Sound taken from myinstants.com
  // https://www.myinstants.com/en/instant/money-soundfx-72186/
  soundFormats("mp3");
  sfx = loadSound(
    "https://cdn.glitch.global/70ee0c25-cb3f-4748-b676-ffff0572a083/money-soundfx.mp3?v=1745942245305"
  );

  // Image taken from Entrepreneur
  // https://www.entrepreneur.com/growing-a-business/jeff-bezos-biography-how-he-started-amazon-and-more/197608
  bezosImg = loadImage(
    "https://cdn.glitch.global/70ee0c25-cb3f-4748-b676-ffff0572a083/BigBezos.jpeg?v=1745906405933"
  );

  // Image taken from rechargenews
  // https://www.rechargenews.com/wind/blackrock-unit-shut-out-of-7-5bn-flagship-korean-wind-project-reports/2-1-1590863
  blackRockImg = loadImage(
    "https://cdn.glitch.global/70ee0c25-cb3f-4748-b676-ffff0572a083/BlackRock.webp?v=1745945845611"
  );

  // Image taken from Wikipedia
  // https://en.wikipedia.org/w/index.php?title=Elon_Musk&oldformat=true#Tham_Luang_cave_rescue_and_defamation_case
  muskImg = loadImage(
    "https://cdn.glitch.global/70ee0c25-cb3f-4748-b676-ffff0572a083/NastyMusk.jpg?v=1745981652888"
  );

  // Image taken from WIRED
  // https://www.wired.com/2017/02/mark-zuckerbergs-answer-world-divided-facebook-facebook/
  zuckImg = loadImage(
    "https://cdn.glitch.global/70ee0c25-cb3f-4748-b676-ffff0572a083/zucc.webp?v=1745981962494"
  );
}

function p3_setup() {}

let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 64;
}
function p3_tileHeight() {
  return 32;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
  let n = clicks[[i, j]] | 0;
  if (n % 2 == 1) {
    sfx.play();
  }
}

function p3_drawBefore() {
  if (XXH.h32("background", worldSeed) % 4 == 0) image(bezosImg, -400, -200);
  else if (XXH.h32("background", worldSeed) % 5 == 0) image(muskImg, 0, -200);
  else if (XXH.h32("background", worldSeed) % 7 == 0)
    image(zuckImg, -550, -800);
  else image(blackRockImg, -220, -200);
}

function p3_drawTile(i, j) {
  noStroke();

  if ((i + j) % 6 == 0 || ((i - j) % 6 == 0 && i != j)) {
    fill(225, 0, 43);
  } else
    -j - 50 >= 0
      ? fill(0, 0, 0, j > -150 ? -j - 50 : 150)
      : fill(255, 255, 255, 0);

  push();
  beginShape();
  vertex(-tw, -th);
  vertex(-tw, th);
  vertex(tw, th);
  vertex(tw, -th);
  endShape(CLOSE);

  let n = clicks[[i, j]] | 0;
  if (n % 2 == 1) {
    textSize(90);
    text("💵", -tw, 0);
    textSize(16);
    if (j < -150) fill(255);
    else fill(0);
    text("Here's $3. Buy yourself fuck all with that.", -2 * tw, -2 * th);
  }

  pop();
}

function p3_drawSelectedTile(i, j) {
  text("Make it to the top! " + [-j], 0, 0);
  if (j < -200) {
    fill(255);
    text("You'll never reach the top. Get back to work.", 0, 16);
  }
  if (j > 50) {
    text("You can't get off. Video games cost money.", 0, -16);
  }
}

function p3_drawAfter() {}
