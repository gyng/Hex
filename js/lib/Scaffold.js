// *Heavily* gutted Scaffold.js to optimise for terribly slow texture animation

function Scaffold() {}

Scaffold.prototype.setupVariables = function (target) {
  this.target = target;

  this.composer = null;
  this.renderer = null;
  this.scene = null;
  this.camera = null;

  this.rendererSettings = {
    browser: true, // Overrides width/height if true, autosizes to clientWidth/height
    width: 640,
    height: 360
  };

  this.cameraSettings = {
    autofov: true, // Overrides viewAngle if rendererSettings.browser === true
    viewAngle: 90,
    aspect: this.rendererSettings.width / this.rendererSettings.height, // Overridden if rendererSettings.browser === true
    near: 0.1,
    far: 10000,
    initialPosition: {
      x: 0,
      y: 0,
      z: 280
    }
  };
};

Scaffold.prototype.setup = function (target) {
  this.setupVariables(target);

  // Setup renderer
  this.renderer = new THREE.WebGLRenderer();

  if (this.rendererSettings.browser === true) {
    var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    this.rendererSettings.width = x;
    this.rendererSettings.height = y;

    this.cameraSettings.aspect = this.rendererSettings.width / this.rendererSettings.height;
  }

  if (this.cameraSettings.autofov === true) {
    // Treat 74deg vertical for 16:9 as optimal
    this.cameraSettings.viewAngle = 74 / (1920 / 1080) * this.cameraSettings.aspect;
  }

  this.renderer.setSize(
      this.rendererSettings.width,
      this.rendererSettings.height);
  this.renderer.autoClear = false;
  this.composer = new THREE.EffectComposer(this.renderer);

  // Setup camera
  this.camera = new THREE.PerspectiveCamera(
      this.cameraSettings.viewAngle,
      this.cameraSettings.aspect,
      this.cameraSettings.near,
      this.cameraSettings.far);

  // Setup scene
  this.scene = new THREE.Scene();
  this.scene.add(this.camera);
  this.camera.position.z = this.cameraSettings.initialPosition.z;

  this.addRenderPasses();

  // Attach to DOM
  var canvas = document.getElementById(this.target + '-canvas');
  canvas.appendChild(this.renderer.domElement);

  this.draw();
};

Scaffold.prototype.draw = function () {
  // Optimisation hack, rendered in in Background.js
};