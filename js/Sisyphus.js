BasicGame.Sisyphus = function (game) {

};

BasicGame.Sisyphus.prototype = {


  create: function () {

    this.stage.backgroundColor = '#AAAAFF';


    // SPRITES

    // BG
    this.sisyphus = this.add.sprite(0,0,'atlas');
    this.sisyphus.animations.add('start',Phaser.Animation.generateFrameNames('sisyphus/sisyphus_', 1, 52, '.png'), 8, false);
    this.sisyphus.animations.add('uphill',Phaser.Animation.generateFrameNames('sisyphus/sisyphus_', 52, 96, '.png'), 8, false);
    this.sisyphus.animations.add('downhill',Phaser.Animation.generateFrameNames('sisyphus/sisyphus_', 96, 52, '.png'), 8, false);
    this.sisyphus.animations.add('fastdownhill',Phaser.Animation.generateFrameNames('sisyphus/sisyphus_', 96, 52, '.png'), 30, false);
    scale(this.sisyphus,4);

    this.sisyphus.animations.play('start');
    this.sisyphus.animations.stop();


    // SFX
    this.peckSFX = this.game.add.audio('peckSFX');
    this.liverSFX = this.game.add.audio('swoopdownSFX');


    // TEXTS

    // INSTRUCTIONS
    var instructionsString = "RAPIDLY CALL THE INPUT() FUNCTION TO PUSH THE BOULDER UP THE HILL!";
    var instructionsStyle = { font: 24 + "px commodore_64_pixelizedregular", fill: "#000000", lineHeight: 2, wordWrap: true, wordWrapWidth: this.game.width - 400, align: "center"};
    this.instructionsText = this.game.add.text(15*4, 20*4, instructionsString, instructionsStyle);
    this.instructionsText.lineSpacing = -8;
    // this.instructionsText.anchor.x = 0.5;

    var statStyle = { font: FONT_SIZE_BIG + "px commodore_64_pixelizedregular", fill: "#ffffff", lineHeight: 2, wordWrap: true, wordWrapWidth: this.game.width - 400, align: "center"};
    this.statText = this.game.add.text(105*4, (this.game.canvas.height/4-15)*4, 'FAILURES: 0', statStyle);
    this.statText.angle = -45;
    this.updateTexts();


    // CPU PLAYER

    context = this;
    setInterval(function () {
      context.INPUT();
    },1000);

  },

  update: function () {

  },


  INPUT: function () {

  },

  updateTexts: function () {

  },

  getAnimationArray: function (name, frames) {
    for (var i = 0; i < frames.length; i++) {
      frames[i] = name + frames[i] + '.png';
    }
    return frames;
  },

};


function scale (sprite,amount) {
  sprite.anchor.x = 0;
  sprite.anchor.y = 0;
  sprite.scale.x *= amount;
  sprite.scale.y *= amount;
}
