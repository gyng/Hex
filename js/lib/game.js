function Game() {
  this.load();
}

Game.prototype = {
  // Assigns loadedCallback to each Image's onload
  // Calls initialize from loadedCallback when all sprites are loaded
  // ! Also assumes sounds load fine !
  load: function () {
    this.sprites = {};
    var spriteSources = [
      ['debughex', './res/sprites/debug-hexagon.png'],
      ['hex0', './res/sprites/hexacube_00.png'],
      ['hex1', './res/sprites/hexacube_01.png'],
      ['hex2', './res/sprites/hexacube_02.png'],
      ['hex3', './res/sprites/hexacube_03.png'],
      ['hex4', './res/sprites/hexacube_04.png'],
      ['hex5', './res/sprites/hexacube_05.png'],
      ['hex6', './res/sprites/hexacube_06.png'],
      ['hex7', './res/sprites/hexacube_07.png'],
      ['player', './res/sprites/player.png'],
      ['player_up', './res/sprites/player_up.png'],
      ['player_down', './res/sprites/player_down.png'],
      ['player_right', './res/sprites/player_right.png'],
      ['player_left', './res/sprites/player_left.png'],
      ['item', './res/sprites/item.png'],
      ['obj_1', './res/sprites/obj_1.png'],
      ['obj_2', './res/sprites/obj_2.png'],
      ['obj_3', './res/sprites/obj_3.png'],
      ['obj_4', './res/sprites/obj_4.png'],
      ['obj_5', './res/sprites/obj_5.png'],
      ['obj_6', './res/sprites/obj_6.png'],
      ['obj_7', './res/sprites/obj_7.png'],
      ['obj_8', './res/sprites/obj_8.png'],
      ['obj_9', './res/sprites/obj_9.png'],
      ['obj_10', './res/sprites/obj_10.png']
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
      if (loadedSprites === spriteSources.length) {
        $('.loading').hide();
        this.initialize(); // Sprites loaded, start the game
      }
    }.bind(this);

    for (var i = 0; i < spriteSources.length; i++) {
      this.sprites[spriteSources[i][0]] = new Image();
      this.sprites[spriteSources[i][0]].onload = loadedCallback;
      this.sprites[spriteSources[i][0]].src = spriteSources[i][1];
    }
  },

  initialize: function () {
    // Rendering variables
    this.canvas = $('#canvas')[0];
    this.context = this.canvas.getContext('2d');
    this.origin = { x: 400, y: 400 };
    this.fps = 60;

    this.scale = 0.6;
    this.fitCanvasToScreen();
    $(window).resize(this.fitCanvasToScreen.bind(this));

    this.setKeybindings();

    // Game variables
    this.rotation = 0;
    this.rotateEasing = 0.08;
    this.rotateTo = 0;
    this.rotationCount = 0;

    this.collectedItems = 0;
    this.playing = false;

    // Level
    this.makeGrid(3, 4);
    this.initializeLevel();
    this.plantItem();
    this.plantItem();
    this.plantItem();

    var playerSprites = {
      up:    this.sprites.player_up,
      down:  this.sprites.player_down,
      left:  this.sprites.player_left,
      right: this.sprites.player_right
    };
    this.player = new Player(this.grid, 0, 0, playerSprites, this.sounds);

    // Begin game loop
    setInterval(this.step.bind(this), 1000 / this.fps);
    this.draw();
  },

  initializeLevel: function () {
    // t in milliseconds
    // fun: function to apply
    // args: array of arguments to pass to function
    this.level = [
      { t: 2500, fun: this.rotate },
      { t: 5000, fun: this.rotate },
      { t: 7000, fun: this.rotate },
      { t: 9500, fun: this.rotate },
      { t: 14500, fun: this.rotate },
      { t: 17000, fun: this.rotate },
      { t: 19500, fun: this.rotate },
      { t: 22000, fun: this.rotate },
      { t: 24000, fun: this.rotate },
      { t: 28000, fun: this.spinUntil, args: [31000] },
      { t: 38000, fun: this.spinUntil, args: [42000] },
      { t: 53000, fun: this.spinUntil, args: [57000] },
      { t: 63000, fun: this.spinUntil, args: [67000] },
      { t: 76000, fun: this.spinUntil, args: [80000] },
      { t: 86000, fun: this.spinUntil, args: [90000] },
      { t: 104000, fun: this.rotate },
      { t: 108000, fun: this.rotate },
      { t: 110000, fun: this.spinUntil, args: [114000] },
      { t: 118000, fun: this.rotate },
      { t: 124000, fun: this.spinUntil, args: [126000] },
      { t: 132000, fun: this.spinUntil, args: [137000] },
      { t: 140000, fun: this.rotate },
      { t: 143000, fun: this.spinUntil, args: [147000] },
      { t: 152000, fun: this.rotate },
      { t: 162000, fun: this.rotate },
      { t: 168000, fun: this.rotate },
      { t: 174000, fun: this.rotate },
      { t: 178000, fun: this.rotate },
      { t: 180000, fun: this.rotate },
      { t: 186000, fun: this.rotate },
      { t: 191000, fun: this.rotate },
      { t: 196000, fun: this.rotate },
      { t: 212000, fun: this.rotate },
      { t: 218000, fun: this.rotate },
      { t: 221000, fun: this.rotate },
      { t: 226000, fun: this.rotate },
      { t: 228000, fun: this.rotate },
      { t: 232000, fun: this.rotate },
      { t: 234000, fun: this.rotate },
      { t: 238000, fun: this.rotate },
      { t: 253000, fun: this.rotate },
      { t: 258000, fun: this.spinUntil, args: [264000] },
      { t: 267000, fun: this.spinUntil, args: [272000] },
      { t: 276000, fun: this.spinUntil, args: [279000] },
      { t: 283000, fun: this.spinUntil, args: [286000] },
      { t: 290000, fun: this.spinUntil, args: [294000] },
      { t: 297000, fun: this.rotate },
      { t: 300000, fun: this.rotate },
      { t: 303000, fun: this.rotate }
    ];
  },

  fitCanvasToScreen: function () {
    this.canvas.width = Math.max($(window).width() * 0.6, $(window).height());
    this.canvas.height = $(window).height() - 5;
    this.context.scale(this.scale, this.scale);
    this.gridOffset = { x: this.canvas.width / 3, y: this.canvas.height / 3 };
  },

  setKeybindings: function () {
    var move = function (dir) {
      this.player.move(dir, this.rotationCount % 3);
      if (!this.playing) this.play();
    };

    keypress.combo('up',    move.bind(this, 'up'));
    keypress.combo('w',     move.bind(this, 'up'));
    keypress.combo('down',  move.bind(this, 'down'));
    keypress.combo('s',     move.bind(this, 'down'));
    keypress.combo('left',  move.bind(this, 'left'));
    keypress.combo('a',     move.bind(this, 'left'));
    keypress.combo('right', move.bind(this, 'right'));
    keypress.combo('d',     move.bind(this, 'right'));

    // Debug bindings
    keypress.combo('space', function () { this.rotate(1); }.bind(this));
    keypress.combo('p', function () { this.plantItem(); }.bind(this));
  },

  step: function () {
    this.rotation += (this.rotateTo - this.rotation) * this.rotateEasing;
    this.player.step();

    // Items
    var playerCell = this.grid[this.player.gridY][this.player.gridX];
    if (typeof playerCell.contents[this.rotationCount % 3] === 'object') {
      this.collectedItems++;
      this.grid[this.player.gridY][this.player.gridX].contents[this.rotationCount % 3] = 0;
      this.changeGridSprites(this.sprites['hex' + (this.collectedItems + 1) % 8]);
      this.plantItem();

      var sound = new Audio();
      sound.src = this.sounds.item.src;
      sound.play();
    }

    // Level events
    this.time = parseInt(this.music.currentTime * 1000, 10);
    var cull = false;

    for (var i = 0; i < this.level.length; i++) {
      var action = this.level[i];
      if (action.t < this.time) {
        var args = action.args ? action.args : null;
        action.cull = action.fun.apply(this, args);
        cull = cull || action.cull;
      }
    }

    // Cleanup level event list
    if (cull) {
      this.level = this.level.filter(function (e) {
        return e.cull !== true;
      });
    }
  },

  rotate: function (times) {
    if (typeof times !== 'number') times = 1;
    this.rotateTo += Math.PI * 2 / 3 * times; // 120deg
    this.rotationCount++;
    return true;
  },

  spinUntil: function (endTime) {
    if (endTime > this.time) {
      if (this.time % 4 === 0) this.rotate();
      return false;
    } else {
      return true;
    }
  },

  draw: function () {
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
  },

  rotateAndCache: function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var offscreenCtx = offscreenCanvas.getContext('2d');

    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;

    offscreenCtx.translate(image.width / 2, image.height / 2);
    offscreenCtx.rotate(angle + Math.PI * 2);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));

    return offscreenCanvas;
  },

  makeGrid: function (width, height) {
    var row, col;

    this.grid = [];

    for (row = 0; row < height; row++) {
      this.grid[row] = [];
      for (col = row % 2; col < width * 2 - row % 2; col += 2) {
        this.grid[row][col] = new Cell(row, col, this.sprites.hex0);
      }
    }

    this.gridCenter = {
      x: width * this.sprites.hex1.width / 2,
      y: height * this.sprites.hex1.height / 3
    };
  },

  drawGrid: function () {
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
              // this.context.fillText(col + ", " + row, 150, 150); // debug
              this.drawItems(cell);
            }
          this.context.restore();
      }
    }

    this.context.restore();
  },

  changeGridSprites: function (sprite) {
    for (var i = 0; i < this.grid.length; i++) {
      for (var j = 0; j < this.grid[i].length; j++) {
        if (this.grid[i] && this.grid[i][j]) {
          this.grid[i][j].image = sprite;
        }
      }
    }
  },

  drawItems: function (cell) {
    for (var i = 0; i < cell.contents.length; i++) {
      if (typeof cell.contents[i] === 'object') {
        this.context.save();
          var item = cell.contents[i];
          var cellOffsetScreenCoordinates = item.getScreenCoordinates();
          var rotatedImage = this.rotateAndCache(item.image, Math.PI * 2 / 3 * -i);
          this.context.drawImage(rotatedImage, cellOffsetScreenCoordinates.x, cellOffsetScreenCoordinates.y);
        this.context.restore();
      }
    }
  },

  drawPlayer: function () {
    this.context.save();

    var x = this.player.screenX;
    var y = this.player.screenY;

    var rotationState = this.rotationCount % 3;
    if (rotationState === 0) y -= this.player.width * 0.1;
    if (rotationState === 1) y -= this.player.width * 0.2;
    if (rotationState === 2) {
      y -= this.player.width * 0.1;
      x -= this.player.width * 0.05;
    }

    this.context.drawImage(
      this.rotateAndCache(this.player.image(), -this.rotation),
      x, y,
      this.player.width, this.player.height
    );

    this.context.restore();
  },

  play: function () {
    this.playing = true;
    this.music.play();
    $(".instructions").fadeOut();
  },

  plantItem: function (x, y, sector) {
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

    var spriteID = 'obj_' + randomInt(1, 10);

    // Indeterministic
    while (!planted && tries < 1000) {
      tries++;
      var col = (x === null || typeof x === 'undefined') ? randomProperty(this.grid) : this.grid[x];
      var cell = (y === null || typeof y === 'undefined') ? randomProperty(col) : this.grid[x][y];
      sector = (sector === null || typeof sector === 'undefined') ? randomInt(0, 2) : sector;

      if (typeof cell.contents[sector] !== 'object') {
        cell.addItem(sector, new Item(this.sprites[spriteID]));
        planted = true;
      }
    }

    return true;
  }
};