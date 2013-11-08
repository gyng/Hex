function Player(grid, x, y, sprites, sounds) {
  this.grid = grid;
  this.gridX = x;
  this.gridY = y;
  this.sprites = sprites;
  this.width = 128; // Divided by 2 for rotation hack
  this.height = 128;
  this.sounds = sounds;

  this.gotoCoordinates = this.getScreenCoordinates();
  this.screenX = 0;
  this.screenY = 0;

  this.easing = 0.2;
  this.lastDirection = 'right';
}

Player.prototype.step = function () {
  this.screenX += (this.gotoCoordinates.x - this.screenX) * this.easing;
  this.screenY += (this.gotoCoordinates.y - this.screenY) * this.easing;
};

Player.prototype.image = function () {
  return this.sprites[this.lastDirection];
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

  var newX = this.gridX + deltas[rotation][direction].x;
  var newY = this.gridY + deltas[rotation][direction].y;

  if (typeof this.grid[newY] !== 'undefined' && typeof this.grid[newY][newX] !== 'undefined') {
    this.gridX = newX;
    this.gridY = newY;

    var sound = new Audio();
    sound.src = this.sounds.move.src;
    sound.play();
  }

  this.gotoCoordinates = this.getScreenCoordinates();
  this.lastDirection = direction;
};

Player.prototype.getScreenCoordinates = function () {
  var playerCell = this.grid[this.gridY][this.gridX];
  var screenCoordinates = playerCell.getScreenCoordinates();
  screenCoordinates.x -= playerCell.image.width + this.width / 2;
  screenCoordinates.y -= playerCell.image.height;

  return screenCoordinates;
};
