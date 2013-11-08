function Background() {
  this.setup('background');
  this.mat = null;
  this.canvas = document.getElementById('canvas');
  this.texture = null;
  this.plane = null;

  // Rendering hack
  this.fps = 10;
  this.now = Date.now();
  this.then = Date.now();
  this.interval = 1000/this.fps;
  this.delta = 0;

  this.updateTexture();
}

Background.prototype = new Scaffold();

Background.prototype.constructor = Background;

Background.prototype.addRenderPasses = function () {
  var scenePass = new THREE.RenderPass(this.scene, this.camera);
  scenePass.clear = false;
  this.composer.addPass(scenePass);

  var kaleidoEffect = new THREE.ShaderPass(THREE.KaleidoShader);
  this.composer.addPass(kaleidoEffect);

  var rgbEffect = new THREE.ShaderPass(THREE.RGBShiftShader);
  rgbEffect.renderToScreen = true;

  this.composer.addPass(rgbEffect);
};

Background.prototype.updateTexture = function () {
    // Hack frame limit requestAnimationFrame
    requestAnimationFrame(this.updateTexture.bind(this));

    this.now = Date.now();
    this.delta = this.now - this.then;

    if (this.delta > this.interval) {
        this.then = this.now - (this.delta % this.interval);

        // Drawing code
        this.texture = new THREE.Texture(this.canvas);
        this.texture.needsUpdate = true;

        if (this.plane === null) {
          this.mat = new THREE.MeshBasicMaterial({ map: this.texture });
          this.plane = new THREE.Mesh(new THREE.PlaneGeometry(800, 800, 1, 1), this.mat);
          this.plane.lookAt(new THREE.Vector3(0.0, 0.0, 1.0));
          this.plane.position.z = 200;
          this.plane.name = 'plane';
          this.scene.add(this.plane);
        }

        this.plane.material.map = this.texture; // Reassign new texture from canvas

        this.composer.render();
    }
};