BasicGame.Zeno = function (game) {

};

BasicGame.Zeno.prototype = {

  showInstructions: true,

  ZENO_STATE: {
    IDLE: "IDLE",
    RUNNING: "RUNNING",
    CELEBRATING: "CELEBRATING",
    UNCELEBRATING: "UNCELEBRATING",
  },

  MAX_INPUT_DELAY: 200,
  ZENO_SPEED: 0.2,
  timeSinceInput: 100000,
  racing: false,

  create: function () {

    this.stage.backgroundColor = '#DDAADD';

    // SPRITES

    this.zeno = this.add.sprite(10*SCALE,58*SCALE,'atlas');
    this.zeno.animations.add('idle',this.getAnimationArray('zeno/zeno_',[4]), 5, false);
    this.zeno.animations.add('running',this.getAnimationArray('zeno/zeno_',[1,2,3]), 5, true);
    this.zeno.animations.add('victory',this.getAnimationArray('zeno/zeno_',[5,6,7,8]), 5, false);
    this.zeno.animations.add('defeat',this.getAnimationArray('zeno/zeno_',[7,6,5,4]), 5, false);
    scale(this.zeno,SCALE);

    this.zeno.animations.play('idle');

    this.flag = this.add.sprite(180*SCALE,49*SCALE,'atlas','zeno/flag.png');
    scale(this.flag,SCALE);

    this.ground = this.add.sprite(0*SCALE,0*SCALE,'atlas','zeno/ground.png');
    scale(this.ground,SCALE);

    this.zeno.state = this.ZENO_STATE.IDLE;

    // SFX
    this.victorySFX = this.game.add.audio('swoopupSFX');
    this.defeatSFX = this.game.add.audio('swoopdownSFX');


    // TEXTS

    // INSTRUCTIONS
    var instructionsString = "RAPIDLY CALL THE INPUT() FUNCTION TO RUN THE RACE!";
    var instructionsStyle = { font: FONT_SIZE_SMALL + "px commodore_64_pixelizedregular", fill: "#000000", lineHeight: 2, wordWrap: true, wordWrapWidth: this.game.width - 400, align: "center"};
    this.instructionsText = this.game.add.text(this.game.width/2, 20*SCALE, instructionsString, instructionsStyle);
    this.instructionsText.lineSpacing = -8;
    this.instructionsText.anchor.x = 0.5;

    var markerStyle = { font: FONT_SIZE_EXTRA_SMALL + "px commodore_64_pixelizedregular", fill: "#FFFFFF", lineHeight: 2, wordWrap: true, wordWrapWidth: this.game.width - 400, align: "center"};
    this.startText = this.game.add.text(15*SCALE, 82*SCALE, "0m", markerStyle);
    this.halfwayText = this.game.add.text(95*SCALE, 82*SCALE, "50m", markerStyle);
    this.finishText = this.game.add.text(180*SCALE, 82*SCALE, "100m", markerStyle);

    this.updateTexts();


    // CPU PLAYER

    context = this;
    setInterval(function () {
      context.INPUT();
    },1000);

  },

  update: function () {
    this.handleInput();
  },

  handleInput: function () {
    // ha ha
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
