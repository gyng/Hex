function Game() {
  this.canvas = $('#canvas')[0];
  this.context = this.canvas.getContext('2d');
  this.origin = { x: 400, y: 400 };
  this.fps = 60;

  this.rotation = 0;
  this.rotateEasing = 0.08;
  this.rotateTo = 0;
  this.rotationCount = 0;

  this.scale = 0.6;
  this.fitCanvasToScreen();
  $(window).resize(this.fitCanvasToScreen.bind(this));

  // t in milliseconds, fun: function to apply, args: arguments to pass to function
  this.level = [
    { t: 3000, fun: this.rotate, args: [1] },
    { t: 5000, fun: this.rotate },
    { t: 5000, fun: this.plantItem },
    { t: 7000, fun: this.rotate },
    { t: 5000, fun: this.plantItem, args: [2, 2] },
    { t: 9000, fun: this.rotate },
    { t: 12000, fun: this.rotate },
    { t: 12000, fun: this.plantItem },
    { t: 14500, fun: this.rotate },
    { t: 14500, fun: this.plantItem },
  ];

  // Preload resources
  this.sprites = {};
  var spriteSources = [
    ['hex0', './res/sprites/debug-hexagon.png'],
    ['hex1', './res/sprites/hexacube_01.png'],
    ['hex2', './res/sprites/hexacube_02.png'],
    ['hex3', './res/sprites/hexacube_03.png'],
    ['hex4', './res/sprites/hexacube_04.png'],
    ['hex5', './res/sprites/hexacube_05.png'],
    ['hex6', './res/sprites/hexacube_06.png'],
    ['hex7', './res/sprites/hexacube_07.png'],
    ['player', './res/sprites/player.png'],
    ['item', './res/sprites/item.png']
  ];

  // Preload audio -- when played create a new Audio instance and set
  // that object's src to the preloaded Audio's src for overlapping
  // playback
  this.sounds = {};
  this.sounds.move = new Audio('./res/sounds/click.ogg');
  this.sounds.item = new Audio('./res/sounds/coin.ogg');
  this.music = document.getElementById('music');

  // Loader
  var loadedSprites = 0;
  var loadedCallback = function () {
    loadedSprites++;

    if (loadedSprites == spriteSources.length) {
      // Sprites loaded, start the game
      // Game variables
      this.collectedItems = 0;
      this.playing = false;

      this.setKeybindings();

      this.makeGrid(3, 4);
      this.plantItem();
      this.plantItem();
      this.plantItem();

      this.player = new Player(this.grid, 0, 0, this.sprites.player, this.sounds);

      $('.loading').hide();

      setInterval(this.step.bind(this), 1000 / this.fps);
      this.draw();
    }
  }.bind(this);

  for (var i = 0; i < spriteSources.length; i++) {
    this.sprites[spriteSources[i][0]] = new Image();
    this.sprites[spriteSources[i][0]].onload = loadedCallback;
    this.sprites[spriteSources[i][0]].src = spriteSources[i][1];
  }
}

Game.prototype.fitCanvasToScreen = function () {
  this.canvas.width = Math.max($(window).width() * 0.6, $(window).height());
  this.canvas.height = $(window).height() - 5;
  this.context.scale(this.scale, this.scale);
  this.gridOffset = { x: this.canvas.width / 3, y: this.canvas.height / 3 };
};

Game.prototype.setKeybindings = function () {
  keypress.combo('space', function () {
    this.rotate(1);
  }.bind(this));

  var move = function (dir) {
    this.player.move(dir, this.rotationCount % 3);
    if (!this.playing) this.play();
  };

  keypress.combo('up', move.bind(this, 'up'));
  keypress.combo('w', move.bind(this, 'up'));

  keypress.combo('down', move.bind(this, 'down'));
  keypress.combo('s', move.bind(this, 'down'));

  keypress.combo('left', move.bind(this, 'left'));
  keypress.combo('a', move.bind(this, 'left'));

  keypress.combo('right', move.bind(this, 'right'));
  keypress.combo('d', move.bind(this, 'right'));
};

Game.prototype.step = function () {
  this.rotation += (this.rotateTo - this.rotation) * this.rotateEasing;
  this.player.step();

  // Items
  var playerCell = this.grid[this.player.gridY][this.player.gridX];
  if (typeof playerCell.contents[this.rotationCount % 3] === 'object') {
    this.grid[this.player.gridY][this.player.gridX].contents[this.rotationCount % 3] = 0;
    this.collectedItems++;

    this.changeGridSprites(this.sprites['hex' + (this.collectedItems + 1) % 8]);

    var sound = new Audio();
    sound.src = this.sounds.item.src;
    sound.play();
  }

  // Level events
  var time = parseInt(this.music.currentTime * 1000, 10);
  var cull = false;
  for (var i = 0; i < this.level.length; i++) {
    var action = this.level[i];
    if (action.t < time) {
      var args = action.args ? action.args : null;
      action.fun.apply(this, args);
      action.cull = true;
      cull = true;
    }
  }

  // Cleanup level event list
  if (cull) {
    this.level = this.level.filter(function (e) {
      return e.cull !== true;
    });
  }
};

Game.prototype.rotate = function (times) {
  if (typeof times !== 'number') times = 1;
  this.rotateTo += Math.PI * 2 / 3 * times; // 120deg
  this.rotationCount++;
};

Game.prototype.draw = function () {
  // Clear canvas
  this.context.save();
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.context.restore();

  // Draw grid, player
  this.context.save();
    this.context.translate(this.gridOffset.x, this.gridOffset.y);
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
      this.grid[row][col] = new Cell(row, col, this.sprites.hex1);
    }
  }

  this.gridCenter = {
    x: width * this.sprites.hex1.width / 2,
    y: height * this.sprites.hex1.height / 3
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
    if (cell.contents[i].constructor.name === 'Item') {
      var item = cell.contents[i];
      var cellOffsetScreenCoordinates = item.getScreenCoordinates();
      this.context.drawImage(item.image, cellOffsetScreenCoordinates.x, cellOffsetScreenCoordinates.y);
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

Game.prototype.play = function () {
  this.playing = true;
  this.music.play();
  $(".instructions").fadeOut();
};

Game.prototype.plantItem = function (x, y, sector) {
  var randomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  var randomProperty = function (obj) {
    var keys = Object.keys(obj);
    return obj[keys[ keys.length * Math.random() << 0]];
  };

  var newx, newy, newSector;

  var planted = false;
  var tries = 0;
  while (!planted && tries < 100) {
    tries++;
    var col = (x === null || typeof x === 'undefined') ? randomProperty(this.grid) : this.grid[x];
    var cell = (y === null || typeof y === 'undefined') ? randomProperty(col) : this.grid[x][y];
    sector = (sector === null || typeof sector === 'undefined') ? randomInt(0, 2) : sector;

    if (cell.contents[sector].constructor.name !== 'Item') {
      cell.addItem(sector, new Item(this.sprites.item));
      planted = true;
    }
  }
};