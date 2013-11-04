function Item(sprite, sector, cell) {
  this.cell = cell;
  this.sector = sector;
  this.image = sprite;
}

Item.prototype = {
  getScreenCoordinates: function () {
    switch (this.sector) {
    case 0:
      return {
        x: this.cell.image.width / 2 - this.image.width / 2,
        y: this.cell.image.height * 3 / 4 - this.image.height / 2
      };
    case 1:
      return {
        x: this.cell.image.width * 2 / 3,
        y: this.cell.image.height * 1 / 3
      };
    case 2:
      return {
        x: this.cell.image.width *1 / 3 - this.image.width,
        y: this.cell.image.height * 1 / 3
      };
    }
  }
};