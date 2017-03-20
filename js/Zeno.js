BasicGame.Zeno = function (game) {

};

BasicGame.Zeno.prototype = {

  showInstructions: true,

  STATE: {
    READY: "READY",
    RUNNING: "RUNNING",
    PRECELEBRATING: "PRECELEBRATING",
    CELEBRATING: "CELEBRATING",
    REVERT: "REVERT",
    PREUNCELEBRATING: "PREUNCELEBRATING",
    UNCELEBRATING: "UNCELEBRATING",
  },

  ZENO_START_X: 10*4,
  ZENO_HALFWAY_X: 88*4,
  start: 0,
  halfWay: 50,
  finish: 100,
  halves: 100,
  halfMore: 50,
  MAX_INPUT_DELAY: 200,
  ZENO_SPEED: 0.2,
  timeSinceInput: 100000,
  racing: false,
  state: undefined,

  create: function () {

    this.stage.backgroundColor = '#DDAADD';

    this.state = this.STATE.RUNNING;
    // SPRITES

    this.zeno = this.add.sprite(10*SCALE,58*SCALE,'atlas');
    this.zeno.animations.add('idle',this.getAnimationArray('zeno/zeno_',[4]), 5, false);
    this.zeno.animations.add('run5',this.getAnimationArray('zeno/zeno_',[1,2,3]), 5, true);
    this.zeno.animations.add('run10',this.getAnimationArray('zeno/zeno_',[1,2,3]), 10, true);
    this.zeno.animations.add('run15',this.getAnimationArray('zeno/zeno_',[1,2,3]), 15, true);
    this.zeno.animations.add('run20',this.getAnimationArray('zeno/zeno_',[1,2,3]), 20, true);
    this.zeno.animations.add('celebrating',this.getAnimationArray('zeno/zeno_',[5,6,7,8]), 5, false);
    this.zeno.animations.add('uncelebrating',this.getAnimationArray('zeno/zeno_',[7,6,5,4]), 5, false);
    scale(this.zeno,SCALE);

    this.zeno.animations.play('idle');

    this.flag = this.add.sprite(180*SCALE,49*SCALE,'atlas','zeno/flag.png');
    scale(this.flag,SCALE);

    this.ground = this.add.sprite(0*SCALE,0*SCALE,'atlas','zeno/ground.png');
    scale(this.ground,SCALE);

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

    this.halfWayAnnounceText = this.game.add.text(this.game.width/2, 40*SCALE, "HALF-WAY THERE!", instructionsStyle);
    this.halfWayAnnounceText.lineSpacing = -8;
    this.halfWayAnnounceText.anchor.x = 0.5;
    this.halfWayAnnounceText.visible = false;

    var markerStyle = { font: FONT_SIZE_EXTRA_SMALL + "px commodore_64_pixelizedregular", fill: "#FFFFFF", lineHeight: 2, wordWrap: true, wordWrapWidth: this.game.width - 400, align: "center"};
    this.startText = this.game.add.text(15*SCALE, 82*SCALE, "0m", markerStyle);
    this.halfWayText = this.game.add.text(95*SCALE, 82*SCALE, "50m", markerStyle);
    this.finishText = this.game.add.text(180*SCALE, 82*SCALE, "100m", markerStyle);

    this.updateTexts();


    // CPU PLAYER

    context = this;
    setInterval(function () {
      context.INPUT();
    },100);

  },

  update: function () {

    this.timeSinceInput += this.time.elapsed;

    if (this.zeno.x >= 50*SCALE && this.instructionsText.visible) {
      this.instructionsText.visible = false;
    }

    if (this.zeno.x >= this.ZENO_HALFWAY_X && this.state != this.STATE.PRECELEBRATING && this.state != this.STATE.CELEBRATING && this.state != this.STATE.REVERT) {
      this.zeno.animations.play("idle");
      this.state = this.STATE.PRECELEBRATING;
      this.time.events.add(1000,this.celebrate,this);

    }
    else if (this.state == this.STATE.CELEBRATING && this.zeno.animations.currentAnim.isFinished) {
      console.log("This?");
      this.state = this.STATE.REVERT;
      this.startText.visible = false;
      this.startText.text = this.halfWayText.text;
    }
    else if (this.state == this.STATE.UNCELEBRATING && this.zeno.animations.currentAnim.isFinished) {
      this.state = this.STATE.RUNNING;
      this.zeno.animations.play("idle");
      this.halfMore = this.halfMore / 2;
      this.halfWay = this.halfWay + this.halfMore;
      if (this.halfWay < 99.9999999999999) {
        this.halfWayText.text = this.halfWay.toString() + "m";
      }
      else {
        if (this.startText.text == "HALF-WAY") {
          this.startText.text = "ALMOST\nHALF-WAY";
        }
        this.halfWayText.text = "HALF-WAY";
      }
      this.halfWayText.visible = true;
      this.halfWayText.x = 95 * SCALE;
    }
    else if (this.state == this.STATE.RUNNING) {
      if (this.activated) {
        if (this.halves > 10) {
          this.zeno.animations.play("run5");
          this.zeno.x += 0.2*SCALE;
        }
        else if (this.halves > 1) {
          this.zeno.animations.play("run10");
          this.zeno.x += 0.5*SCALE;
        }
        else if (this.halves > 0.1) {
          this.zeno.animations.play("run15");
          this.zeno.x += 1.0*SCALE;
        }
        else {
          this.zeno.animations.play("run20");
          this.zeno.x += 2.0*SCALE;
        }
      }
      else {
        this.zeno.animations.play("idle");
      }
    }
    else if (this.state == this.STATE.REVERT) {
      if (this.zeno.x > this.ZENO_START_X) {
        this.zeno.x -= 0.5*SCALE;
        this.halfWayText.x -= 0.5*SCALE;
      }
      else {
        this.startText.visible = true;
        this.halfWayText.visible = false;
        this.state = this.STATE.PREUNCELEBRATING;
        this.time.events.add(1000,this.uncelebrate,this);

      }
    }

    if (this.timeSinceInput > this.MAX_INPUT_DELAY) {
      this.activated = false;
    }

  },

  celebrate: function () {
    this.state = this.STATE.CELEBRATING;
    this.zeno.animations.play("celebrating");
    this.victorySFX.play();
    this.halfWayAnnounceText.visible = true;
  },


  uncelebrate: function () {
    this.halves = this.halves/2;
    this.state = this.STATE.UNCELEBRATING;
    this.zeno.animations.play("uncelebrating");
    this.defeatSFX.play();
    this.halfWayAnnounceText.visible = false;
  },


  handleInput: function () {
    // ha ha
  },

  INPUT: function () {
    this.timeSinceInput = 0;
    this.activated = true;
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
