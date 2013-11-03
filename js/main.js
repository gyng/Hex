require([
  "vendor/three/three.min",
  "vendor/three/CopyShader",
  "vendor/three/MaskPass",
  "vendor/three/EffectComposer",
  "vendor/three/KaleidoShader",
  "vendor/three/RenderPass",
  "vendor/three/RGBShiftShader",
  "vendor/three/ShaderPass",
  "vendor/jquery-2.0.3.min",
  "vendor/keypress-1.0.8.min",
  "lib/Scaffold",
  "lib/background",
  "lib/player",
  "lib/item",
  "lib/cell",
  "lib/game"], function () {
  'use strict';

  $(document).ready(function () {
    new Game();
    new Background('background');
  });
});