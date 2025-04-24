/* exported generateGrid, drawGrid */
/* global placeTile */

// check if grid index contains the target variable
function gridCheck(grid, i, j, target) {
  if (i >= grid.length || j >= grid[i].length) return false;
  if (grid[i][j] != target) return false;
  return true;
}

function gridCode(grid, i, j, target) {
  if (i >= grid.length || j >= grid[i].length) return;
  let code = 0;
  if (i - 1 >= 0 && gridCheck(grid, i - 1, j, target)) code += 1 << 0; // north
  if (i + 1 < grid.length && gridCheck(grid, i + 1, j, target)) code += 1 << 1; // south
  if (j + 1 < grid[i].length && gridCheck(grid, i, j + 1, target))
    code += 1 << 2; // east
  if (j - 1 >= 0 && gridCheck(grid, i, j - 1, target)) code += 1 << 3; // west
  return code;
}

function drawContext(grid, i, j, target, ti, tj) {
  let code = gridCode(grid, i, j, target);
  if (code < 0 || code >= lookup.length) return;
  const [tiOffset, tjOffset] = lookup[code];
  placeTile(i, j, ti + tiOffset, tj + tjOffset);
  return;
}

const lookup = [
  [0, 4],
  [1, 4],
  [2, 4],
  [3, 4],
  [0, 4],
  [1, 4],
  [2, 4],
  [3, 4],
  [0, 4],
  [1, 4],
  [2, 4],
  [3, 4],
  [0, 4],
  [1, 4],
  [2, 4],
  [31, 31],
];

// trying again with the river generation
// made with Google Ai given prompt:
// p5.js how to generate a river in a 2D array
function newRiver(numCols, numRows) {
  let startX = floor(random(numCols));
  let startY = 0;
  let endY = numRows - 1;

  let x = startX;
  let y = startY;
  let path = [[x, y]];

  while (y < endY) {
    let possibleMoves = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
    ];
    possibleMoves = possibleMoves.filter(
      ([nx, ny]) => nx >= 0 && nx < numCols && ny >= 0 && ny < numRows
    ); // Keep the path inside the grid
    let nextMove = random(possibleMoves);

    x = nextMove[0];
    y = nextMove[1];
    path.push([x, y]);
  }
  return path;
}

function nextToWater(grid, x, y) {
  for (let i = 1; i < 3; i++) {
    if (grid[x - i][y] == "w") return true;
    if (grid[x - i][y - i] == "w") return true;
    if (grid[x - i][y + i] == "w") return true;
    if (grid[x][y - i] == "w") return true;
    if (grid[x][y + i] == "w") return true;
    if (grid[x + i][y] == "w") return true;
    if (grid[x + i][y - i] == "w") return true;
    if (grid[x + i][y + i] == "w") return true;
  }
  return false;
}

function createTower(grid) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (
        floor(random(70)) == 69 &&
        i < grid.length - 2 &&
        j < grid[i].length - 2 &&
        i > 2 &&
        j > 1 &&
        !nextToWater(grid, i, j)
      ) {
        grid[i][j] = "t";
      }
    }
  }
}

function generateGrid(numCols, numRows) {
  let grid = [];
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push(".");
    }
    grid.push(row);
  }

  // now we should add extra details to the base layer
  //generateRiver(grid, numCols, numRows);
  let riverPath = newRiver(numCols, numRows);
  for (let [x, y] of riverPath) {
    grid[x][y] = "w"; // Set river value
  }

  createTower(grid);

  return grid;
}

function drawGrid(grid) {
  background(128);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      placeTile(i, j, floor(random(4)), 3);
      if (grid[i][j] == ".") {
        placeTile(i, j, floor(random(3)) + 14, 3);
        drawContext(grid, i, j, ".", 0, 0);
      }
      if (grid[i][j] == "w") {
        placeTile(i, j, floor(random(4)), 13);
      }
      if (grid[i][j] == "t") {
        placeTile(i, j, 30, 1);
        placeTile(i - 1, j, 30, 0);
      }
    }
  }
}
