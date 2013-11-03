function Game() {
  this.canvas = $('#canvas')[0];
  this.context = this.canvas.getContext('2d');
  this.origin = { x: 400, y: 400 };
  this.fps = 60;

  this.rotation = 0;
  this.rotateEasing = 0.08;
  this.rotateTo = 0;
  this.rotationCount = 0;

  // Preload resources
  this.sprites = {};
  this.sprites.hex = new Image();
  this.sprites.hex.src = './res/sprites/debug-hexagon.png';
  this.sprites.hex1 = new Image();
  this.sprites.hex1.src = './res/sprites/hexacube_01.png';
  this.sprites.hex2 = new Image();
  this.sprites.hex2.src = './res/sprites/hexacube_02.png';
  this.sprites.hex3 = new Image();
  this.sprites.hex3.src = './res/sprites/hexacube_03.png';
  this.sprites.hex4 = new Image();
  this.sprites.hex4.src = './res/sprites/hexacube_04.png';
  this.sprites.hex5 = new Image();
  this.sprites.hex5.src = './res/sprites/hexacube_05.png';
  this.sprites.hex6 = new Image();
  this.sprites.hex6.src = './res/sprites/hexacube_06.png';
  this.sprites.hex7 = new Image();
  this.sprites.hex7.src = './res/sprites/hexacube_07.png';

  this.sprites.player = new Image();
  this.sprites.player.src = './res/sprites/player.png';
  this.sprites.item = new Image();
  this.sprites.item.src = './res/sprites/item.png';

  // Preload audio -- when played create a new Audio instance and set
  // that object's src to the preloaded Audio's src for overlapping
  // playback
  this.sounds = {};
  this.sounds.move = new Audio('./res/sounds/click.ogg');
  this.sounds.item = new Audio('./res/sounds/coin.ogg');

  // Game variables
  this.collectedItems = 0;

  this.setKeybindings();
  this.makeGrid(3, 4);
  this.grid[1][1].contents[0] = { image: this.sprites.item };
  this.grid[1][1].contents[1] = { image: this.sprites.item };
  this.grid[1][1].contents[2] = { image: this.sprites.item };
  this.player = new Player(this.grid, 0, 0, this.sprites.player, this.sounds);

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
  this.rotation += (this.rotateTo - this.rotation) * this.rotateEasing;
  this.player.step();

  // Items
  var playerCell = this.grid[this.player.gridY][this.player.gridX];
  if (typeof playerCell.contents[this.rotationCount % 3] === 'object') {
    this.grid[this.player.gridY][this.player.gridX].contents[this.rotationCount % 3] = 0;
    this.collectedItems++;

    this.changeGridSprites(this.sprites['hex' + this.collectedItems]);

    var sound = new Audio();
    sound.src = this.sounds.item.src;
    sound.play();
  }
};

Game.prototype.draw = function () {
  // Clear canvas
  this.context.save();
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.context.restore();

  // Draw grid, player
  this.context.save();
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
    for (col = row % 2; col < width * 2 - row % 2; col += 2) {
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

  this.context.translate(-this.gridCenter.x, -this.gridCenter.y);

  for (var row = 0; row < this.grid.length; row++) {
    for (var col = 0; col < this.grid[0].length; col++) {
        this.context.save();
          var cell = this.grid[row][col];
          if (typeof cell !== 'undefined') {
            var coords = cell.getScreenCoordinates();
            this.context.translate(coords.x, coords.y);
            this.context.drawImage(cell.image, 0, 0);
            this.context.fillText(col + ", " + row, 150, 150); // debug
            this.drawItems(cell);
          }
        this.context.restore();
    }
  }

  this.context.restore();
};

Game.prototype.changeGridSprites = function (sprite) {
  for (var i = 0; i < this.grid.length; i++) {
    for (var j = 0; j < this.grid[i].length; j++) {
      if (this.grid[i] && this.grid[i][j]) {
        this.grid[i][j].image = sprite;
      }
    }
  }
};

Game.prototype.drawItems = function (cell) {
  for (var i = 0; i < cell.contents.length; i++) {
    if (typeof cell.contents[i] === 'object') {
      var item = cell.contents[i];

      switch (i) {
      case 0:
        this.context.drawImage(
          item.image,
          cell.image.width / 2 - item.image.width / 2,
          cell.image.height * 3 / 4 - item.image.height / 2
        );
        break;
      case 1:
        this.context.drawImage(
          item.image,
          cell.image.width * 2 / 3,
          cell.image.height * 1 / 3
        );
        break;
      case 2:
        this.context.drawImage(
          item.image,
          cell.image.width *1 / 3 - item.image.width,
          cell.image.height * 1 / 3
        );
        break;
      }
    }
  }
};

Game.prototype.drawPlayer = function () {
  this.context.save();

  this.context.drawImage(
    this.player.image,
    this.player.screenX, this.player.screenY,
    this.player.width, this.player.height
  );

  this.context.restore();
};