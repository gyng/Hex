(function () {
  'use strict';

  $(document).ready(function () {
    new Game();
  });

  function Game() {
    this.canvas = $('#canvas')[0];
    this.context = this.canvas.getContext('2d');
    this.origin = { x: 400, y: 400 };
    this.fps = 60;

    this.rotation = 0;
    this.rotateSpeed = 0.05;
    this.rotateTo = 0;
    this.rotationCount = 0;

    this.sprites = {};
    this.sprites.hex = new Image();
    this.sprites.hex.src = './res/debug-hexagon.png';
    this.sprites.player = new Image();
    this.sprites.player.src = './res/player.png';

    this.setKeybindings();
    this.makeGrid(3, 4);
    this.player = new Player(0, 0, this.sprites.player);

    setInterval(this.step.bind(this), 1000 / this.fps);
    this.draw();
  }

  Game.prototype.setKeybindings = function () {
    keypress.combo('space', function () {
      this.rotateTo += Math.PI * 2 / 3; // 120deg
      this.rotationCount++;
    }.bind(this));

    keypress.combo('up', function () {
      this.player.move('up', this.rotationCount % 3);
    }.bind(this));

    keypress.combo('down', function () {
      this.player.move('down', this.rotationCount % 3);
    }.bind(this));

    keypress.combo('left', function () {
      this.player.move('left', this.rotationCount % 3);
    }.bind(this));

    keypress.combo('right', function () {
      this.player.move('right', this.rotationCount % 3);
    }.bind(this));
  };

  Game.prototype.step = function () {
    if (this.rotation < this.rotateTo) {
      this.rotation += this.rotateSpeed;
    } else {
      this.rotation = this.rotateTo;
    }
  };

  Game.prototype.draw = function () {
    // Clear canvas
    this.context.save();
      this.context.setTransform(1, 0, 0, 1, 0, 0);
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.restore();

    this.context.save();
      // Update grid
      this.context.translate(this.origin.x, this.origin.y);
      this.context.rotate(this.rotation);
      this.drawGrid();
      this.drawPlayer();
    this.context.restore();

    requestAnimationFrame(this.draw.bind(this));
  };

  Game.prototype.makeGrid = function (width, height) {
    var row, col;

    this.grid = [];

    for (row = 0; row < height; row++) {
      this.grid[row] = [];
      for (col = row % 2; col < width * 2; col += 2) {
        this.grid[row][col] = new Cell(row, col, this.sprites.hex);
      }
    }

    this.gridCenter = {
      x: width * 250 / 2,
      y: height * 290 / 3
    };
  };

  Game.prototype.drawGrid = function () {
    this.context.save();

    var width = this.grid.length;
    var height = this.grid[0].length;

    this.context.translate(-this.gridCenter.x, -this.gridCenter.y);

    for (var row = 0; row < this.grid.length; row++) {
      for (var col = 0; col < this.grid[0].length; col++) {
          this.context.save();
            var cell = this.grid[row][col];
            if (typeof cell !== 'undefined') {
              var coords = cell.screenCoordinates();
              this.context.translate(coords.x, coords.y);
              this.context.drawImage(cell.image, 0, 0);
              this.context.fillText(col + ", " + row, 150, 150); // debug
            }
          this.context.restore();
      }
    }

    this.context.restore();
  };

  Game.prototype.drawPlayer = function () {
    this.context.save();

    // TODO: proper checks
    try {
      var playerCell = this.grid[this.player.gridY][this.player.gridX];
      var playerScreenCoordinates = playerCell.screenCoordinates();

      this.context.drawImage(
        this.player.image,
        playerScreenCoordinates.x - 250 - 64, playerScreenCoordinates.y - 290,
        128, 128
      );
    } catch (e) {
      //
    }

    this.context.restore();
  };

  function Cell(row, col, sprite) {
    this.row = row;
    this.col = col;
    this.image = sprite;
  }

  Cell.prototype.screenCoordinates = function () {
    return {
      x: this.image.width / 2 + this.col * this.image.width * 0.5,
      y: this.row * this.image.width * 0.869
    };
  };

  function Player(x, y, sprite) {
    this.gridX = x;
    this.gridY = y;
    this.image = sprite;
  }

  Player.prototype.step = function () {

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
  };
}());