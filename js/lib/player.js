function Player(grid, x, y, sprite) {
  this.grid = grid;
  this.gridX = x;
  this.gridY = y;
  this.image = sprite;
  this.width = 128;
  this.height = 128;

  this.gotoCoordinates = this.getScreenCoordinates();
  this.screenX = 0;
  this.screenY = 0;
}

Player.prototype.step = function () {
  this.screenX += (this.gotoCoordinates.x - this.screenX) / 5;
  this.screenY += (this.gotoCoordinates.y - this.screenY) / 5;
};

Player.prototype.move = function (direction, rotation) {
  var deltas = [
    {
      // 0
      up:    { x:  1, y: -1 },
      down:  { x: -1, y:  1 },
      left:  { x: -1, y: -1 },
      right: { x:  1, y:  1 }
    },
    {
      // 120
      up:    { x: -2, y:  0 },
      down:  { x:  2, y:  0 },
      left:  { x: -1, y:  1 },
      right: { x:  1, y: -1 }
    },
    {
      // 240
      up:    { x:  1, y:  1 },
      down:  { x: -1, y: -1 },
      left:  { x:  2, y:  0 },
      right: { x: -2, y:  0 }
    }
  ];

  this.gridX += deltas[rotation][direction].x;
  this.gridY += deltas[rotation][direction].y;

  this.gotoCoordinates = this.getScreenCoordinates();
};

Player.prototype.getScreenCoordinates = function () {
  try {
    var playerCell = this.grid[this.gridY][this.gridX];
    var screenCoordinates = playerCell.getScreenCoordinates();
    screenCoordinates.x -= playerCell.image.width + this.width / 2;
    screenCoordinates.y -= playerCell.image.height;

    return screenCoordinates;
  } catch (e) {
    return { x: 0, y: 0 };
  }
};
