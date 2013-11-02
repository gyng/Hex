function Cell(row, col, sprite) {
  this.row = row;
  this.col = col;
  this.image = sprite;
  this.contents = [0, 0, 0];
}

Cell.prototype.getScreenCoordinates = function () {
  return {
    x: this.image.width / 2 + this.col * this.image.width * 0.5,
    y: this.row * this.image.width * 0.869
  };
};