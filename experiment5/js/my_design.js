/* exported getInspirations, initDesign, renderDesign, mutateDesign */

function getInspirations() {
  return [
    {
      name: "StOp YoU vIoLaTeD tHe LaW",
      assetUrl:
        "https://cdn.glitch.global/a1657b36-79c5-4bbb-a008-95fcaed78d69/STOP.jpg?v=1746650611887",
      credit:
        "StOp YoU vIoLaTeD tHe LaW, r/oblivion, 2023 https://www.reddit.com/r/oblivion/comments/14anw0k/stop_you_violated_the_law/. Photo from Bethesda's game Oblivion, 2006",
    },
    {
      name: "The Creation of Adam",
      assetUrl:
        "https://cdn.glitch.global/a1657b36-79c5-4bbb-a008-95fcaed78d69/The-Creation-of-Adam-Michelangelo-Light-and-Value.webp?v=1746650614747",
      credit:
        "The Creation of Adam, Michelangelo, 1512 https://simplykalaa.com/the-creation-of-adam/",
    },
    {
      name: "The Death Star 2",
      assetUrl:
        "https://cdn.glitch.global/a1657b36-79c5-4bbb-a008-95fcaed78d69/DeathStar2.webp?v=1746650617023",
      credit: "https://www.ign.com/wikis/star-wars/Death_Star",
    },
  ];
}

function initDesign(inspiration) {
  resizeCanvas(inspiration.image.width / 4, inspiration.image.height / 4);

  let design = { bg: 128, fg: [] };

  if (inspiration.name == "The Death Star 2") {
    for (let i = 0; i < 100; i++) {
      let xPos = random(width);
      let yPos = random(height);
      design.fg.push({
        x1: xPos,
        y1: yPos,
        x2: xPos + random(width / 10),
        y2: yPos - random(height / 10),
        x3: xPos + random(width / 5),
        y3: yPos - random(height / 10),
        r: random((width + height) / 4),
        fill: random(255),
      });
    }
  } else if (inspiration.name == "The Creation of Adam") {
    for (let i = 0; i < 1000; i++) {
      let xPos = random(width);
      let yPos;
      if (xPos < width / 2) yPos = height / 2 + random(height / 2);
      else yPos = random(height / 2);
      design.fg.push({
        x: xPos,
        y: yPos,
        size: random((height + width) / 10),
        fill: random(255),
      });
    }
  } else {
    // Need to resize this because it's too small with the regular resize
    resizeCanvas(inspiration.image.width / 2, inspiration.image.height / 2);
    for (let i = 0; i < 100; i++) {
      design.fg.push({
        x: random(width),
        y: random(height),
        w: random(width / 2),
        h: random(height / 2),
        fill: random(255),
      });
    }
  }

  return design;
}

function renderDesign(design, inspiration) {
  if (inspiration.name == "The Death Star 2") {
    design.bg = "#000000";
    background(design.bg);
    noStroke();
    for (let tri of design.fg) {
      fill(tri.fill, 128);
      triangle(tri.x1, tri.y1, tri.x2, tri.y2, tri.x3, tri.y3);
    }
  } else if (inspiration.name == "The Creation of Adam") {
    design.bg = "#c8c8c8";
    background(design.bg);
    noStroke();
    let randInt;
    for (let bit of design.fg) {
      randInt = random(1);
      fill(bit.fill, 128);
      textSize(bit.size);
      if (randInt > 0.5) text(1, bit.x, bit.y);
      else text(0, bit.x, bit.y);
    }
  } else {
    design.bg = "#728299";
    background(design.bg);
    noStroke();
    for (let box of design.fg) {
      fill(box.fill, 128);
      rect(box.x, box.y, box.w, box.h);
    }
  }
}

function mutateDesign(design, inspiration, rate) {
  design.bg = mut(design.bg, 0, 255, rate);
  if (inspiration.name == "The Death Star 2") {
    for (let tri of design.fg) {
      tri.x1 = mut(tri.x1, 0, width, rate);
      tri.y1 = mut(tri.y1, 0, height, rate);
      tri.x2 = mut(tri.x2, 0, width, rate);
      tri.y2 = mut(tri.y2, 0, height, rate);
      tri.x3 = mut(tri.x3, 0, width, rate);
      tri.y3 = mut(tri.y3, 0, height, rate);
      tri.fill = mut(tri.full, 128, 255, rate);
    }
  } else {
    for (let box of design.fg) {
      box.x = mut(box.x, 0, width, rate);
      box.y = mut(box.y, 0, height, rate);
      box.w = mut(box.w, 0, width / 2, rate);
      box.h = mut(box.h, 0, height / 2, rate);
      box.fill = mut(box.fill, 0, 255, rate);
    }
  }
}

function mut(num, min, max, rate) {
  return constrain(randomGaussian(num, (rate * (max - min)) / 20), min, max);
}
