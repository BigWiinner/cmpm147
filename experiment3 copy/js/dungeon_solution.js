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
  if (code < 0 || code >= lookupD.length) return;
  const [tiOffset, tjOffset] = lookupD[code];
  placeTile(i, j, ti + tiOffset, tj + tjOffset);
}

const lookupD = [
  [21, 21],
  [16, 23], // bottom wall
  [16, 21], // top wall
  [16, 23],
  [15, 22], // left wall
  [16, 23],
  [16, 23],
  [16, 23],
  [17, 22], // right wall
  [16, 23],
  [16, 23],
  [16, 23],
  [16, 23],
  [16, 23],
  [16, 23],
  [16, 23],
];

// generate a very simple dungeon grid
function createRoom(numCols, numRows, grid) {
  let canPlace = false;
  let randRow;
  let randCol;
  let base;
  let height;

  let attempts = numCols * numRows;
  while (canPlace == false && attempts > 0) {
    randRow = floor(random(numRows)) + 1;
    randRow = randRow < numRows - 5 ? randRow : numRows - 6;
    randCol = floor(random(numCols)) - 3;
    randCol = randCol > 0 ? randCol : 1;
    randCol = randCol < numCols ? randCol : numCols - 1;

    base = randRow + floor(random(10)) + 4;
    base = base < numRows ? base : numRows - 1;
    height = randCol + floor(random(8)) + 3;
    height = height < numCols ? height : numCols - 1;

    canPlace = true;
    for (let i = randRow; i < base; i++) {
      for (let j = randCol; j < height; j++) {
        // check to make sure rect does not overlap with another rect
        if (grid[i][j] == ".") canPlace = false;
        if (grid?.[i + 1]?.[j] == ".") canPlace = false;
        if (grid?.[i - 1]?.[j] == ".") canPlace = false;
        if (grid[i]?.[j + 1] == ".") canPlace = false;
        if (grid[i]?.[j - 1] == ".") canPlace = false;
        if (grid?.[i - 1]?.[j - 1] == ".") canPlace = false;
        if (grid?.[i + 1]?.[j - 1] == ".") canPlace = false;
        if (grid?.[i - 1]?.[j + 1] == ".") canPlace = false;
        if (grid?.[i + 1]?.[j + 1] == ".") canPlace = false;
        if (grid?.[i + 2]?.[j] == ".") canPlace = false;
        if (grid?.[i - 2]?.[j] == ".") canPlace = false;
        if (grid[i]?.[j + 2] == ".") canPlace = false;
        if (grid[i]?.[j - 2] == ".") canPlace = false;
        if (grid?.[i - 2]?.[j - 2] == ".") canPlace = false;
        if (grid?.[i + 2]?.[j - 2] == ".") canPlace = false;
        if (grid?.[i - 2]?.[j + 2] == ".") canPlace = false;
        if (grid?.[i + 2]?.[j + 2] == ".") canPlace = false;
      }
    }
    attempts--;
  }

  if (canPlace) {
    for (let i = randRow; i < base; i++) {
      for (let j = randCol; j < height; j++) {
        grid[i][j] = ".";
      }
    }

    let chests = 0;
    for (let i = randRow; i < base; i++) {
      for (let j = randCol; j < height; j++) {
        if (chests == 0 && floor(random(50)) == 25) {
          if (
            grid[i + 1][j] == "." &&
            grid[i - 1][j] == "." &&
            grid[i][j + 1] == "." &&
            grid[i][j - 1] == "."
          )
            grid[i][j] = "c";
        }
      }
    }
  }
  return grid;
}

function generateGrid(numCols, numRows) {
  let grid = [];
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("X");
    }
    grid.push(row);
  }

  for (let i = 0; i < 3; i++) {
    createRoom(numCols, numRows, grid);
  }

  return grid;
}

function drawGrid(grid) {
  background(128);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] == "X") {
        placeTile(i, j, floor(random(4)) + 11, 21);
      }
      if (gridCheck(grid, i, j, ".")) {
        placeTile(i, j, 20, 21);
      } else {
        drawContext(grid, i, j, ".", 0, 0);
      }
      if (gridCheck(grid, i, j, "c")) {
        placeTile(i, j, 5, 30);
      }
    }
  }
}
