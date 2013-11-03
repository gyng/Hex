require([
  "vendor/jquery-2.0.3.min",
  "vendor/keypress-1.0.8.min",
  "lib/player",
  "lib/item",
  "lib/cell",
  "lib/game"], function() {
  'use strict';

  $(document).ready(function () {
    new Game();
  });
});