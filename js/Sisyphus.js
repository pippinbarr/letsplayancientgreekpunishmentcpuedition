BasicGame.Sisyphus = function (game) {

};

BasicGame.Sisyphus.prototype = {

  SISYPHUS_START_FRAMES: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52],
  SISYPHUS_UPHILL_FRAMES: [51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95],
  SISYPHUS_DOWNHILL_FRAMES: [95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70,69,68,67,66,65,64,63,62,61,60,59,58,57,56,55,54,53,52,51],

  STATE: {
    PRESTART: "PRESTART",
    START: "START",
    BOTTOM: "BOTTOM",
    UPHILL: "UPHILL",
    DOWNHILL: "DOWNHILL",
    REVERT: "REVERT",
  },

  state: undefined,
  activated: false,
  failures: 0,
  timeSinceActived: 10000,
  MAX_ACTIVATED_DELAY: 120,

  create: function () {

    this.stage.backgroundColor = '#AAAAFF';

    this.state = this.STATE.PRESTART;

    // SPRITES

    // BG
    this.sisyphus = this.add.sprite(0,0,'atlas');
    this.sisyphus.animations.add('prestart',Phaser.Animation.generateFrameNames('sisyphus/sisyphus_', 1, 1, '.png'), 8, false);
    this.sisyphus.animations.add('start',Phaser.Animation.generateFrameNames('sisyphus/sisyphus_', 1, 52, '.png'), 8, false);
    this.sisyphus.animations.add('uphill',Phaser.Animation.generateFrameNames('sisyphus/sisyphus_', 52, 96, '.png'), 8, false);
    this.sisyphus.animations.add('downhill',Phaser.Animation.generateFrameNames('sisyphus/sisyphus_', 96, 52, '.png'), 8, false);
    this.sisyphus.animations.add('fastdownhill',Phaser.Animation.generateFrameNames('sisyphus/sisyphus_', 96, 52, '.png'), 30, false);
    scale(this.sisyphus,4);

    this.sisyphus.animations.play('prestart');

    this.sisyphusIndicator = this.add.sprite(this.sisyphus.x,this.sisyphus.y,'atlas','sisyphus/sisyphus_indicator.png');


    // SFX
    this.failureSFX = this.game.add.audio('peckSFX');
    this.downhillSFX = this.game.add.audio('swoopdownSFX');


    // TEXTS

    // INSTRUCTIONS
    var instructionsString = "RAPIDLY CALL THE INPUT() FUNCTION TO PUSH THE BOULDER UP THE HILL!";
    var instructionsStyle = { font: 24 + "px commodore_64_pixelizedregular", fill: "#000000", lineHeight: 2, wordWrap: true, wordWrapWidth: this.game.width - 400, align: "center"};
    this.instructionsText = this.game.add.text(15*4, 20*4, instructionsString, instructionsStyle);
    this.instructionsText.lineSpacing = -8;

    var statStyle = { font: FONT_SIZE_BIG + "px commodore_64_pixelizedregular", fill: "#ffffff", lineHeight: 2, wordWrap: true, wordWrapWidth: this.game.width - 400, align: "center"};
    this.statText = this.game.add.text(105*4, (this.game.canvas.height/4-15)*4, 'FAILURES: 0', statStyle);
    this.statText.angle = -45;
    this.updateTexts();


    // CPU PLAYER

    context = this;
    setInterval(function () {
      context.INPUT();
    },100);

    // this.input.onDown.add(this.onDown,this);

  },

  onDown: function () {
    this.INPUT();
  },

  update: function () {

    // return;
    var frameAtStartOfUpdate = this.getCurrentFrameNumber();
    console.log(this.getCurrentFrameNumber());

    this.timeSinceActived += this.time.elapsed;

    if (this.state == this.STATE.START && this.sisyphus.animations.currentAnim.isFinished) {
      console.log("START > BOTTOM");
      this.state = this.STATE.BOTTOM;
      this.sisyphus.animations.play("uphill");
    }
    else if (this.state == this.STATE.DOWNHILL && this.sisyphus.animations.currentAnim.isFinished) {
      console.log("DOWNHILL > BOTTOM");
      // trace("DOWNHILL AND FINISHED");
      this.state = this.STATE.BOTTOM;
    }
    else if (this.state == this.STATE.UPHILL && this.sisyphus.animations.currentAnim.isFinished) {
      console.log("UPHILL > REVERT");
      this.state = this.STATE.REVERT;
      this.downhillSFX.play();
      this.sisyphus.animations.play("fastdownhill");
    }
    else if (this.state == this.STATE.REVERT && this.sisyphus.animations.currentAnim.isFinished) {
      console.log("REVERT > BOTTOM");
      this.state = this.STATE.BOTTOM;
      this.failures++;
      this.failureSFX.play();
      this.updateTexts();
      if (this.instructionsText.visible) {
        this.instructionsText.visible = false;
      }
    }

    if (this.activated) {
      if (this.state == this.STATE.PRESTART) {
          this.state = this.STATE.START;
          // this.sisyphus.play('start');
          // this.sisyphus.animations.currentAnim.paused = false;
          this.sisyphus.animations.play('start');
          // var currentFrame = this.getCurrentFrameNumber();
          console.log("ACTIVATED: PRESTART > START");
      }
      else if (this.state == this.STATE.START) {
        console.log("ACTIVATED: START");
        // this.sisyphus.animations.currentAnim.paused = false;
        if (this.sisyphus.animations.paused) {
          this.sisyphus.animations.paused = false;
        }
        // this.sisyphus.animations.play('start');

        // trace("START AND KEYS");
        // var currentFrame = this.getCurrentFrameNumber();
        // currentFrame -= (this.SISYPHUS_START_FRAMES.length-1);
        // console.log("START and frame is " + currentFrame);
        // if (currentFrame == this.SISYPHUS_START_FRAMES.length - 1) currentFrame--;
        // this.sisyphus.animations.play('start');
        // this.sisyphus.animations.currentAnim.setFrame(currentFrame+1,true);
      }
      else if (this.state == this.STATE.UPHILL) {
        // trace("UPHILL AND KEYS");
      }
      else if (this.state == this.STATE.BOTTOM) {
        // trace("BOTTOM AND KEYS");
        console.log("ACTIVATED: BOTTOM > UPHILL");
        this.state = this.STATE.UPHILL;
        this.sisyphus.animations.play("uphill");
      }
      else if (this.state == this.STATE.DOWNHILL) {
        console.log("ACTIVATED: DOWNHILL > UPHILL");
        // trace("DOWNHILL AND KEYS");
        this.state = this.STATE.UPHILL;
        var frame = this.convertDownhillToUphill(this.getCurrentFrameNumber());
        this.sisyphus.animations.play('uphill');
        this.sisyphus.animations.currentAnim.setFrame(frame,true);
      }
    }
    else {
      if (this.state == this.STATE.START) {
        // trace("START AND NO KEYS");
        // this.sisyphus.frame = _currentFrame;
        this.sisyphus.animations.paused = true;
        // this.sisyphus.animations.stop(false,false);
        console.log("NOT ACTIVATED: START > STOP")
      }
      else if (this.state == this.STATE.UPHILL) {
        console.log("NOT ACTIVATED: UPHILL > DOWNHILL");
        this.state = this.STATE.DOWNHILL;
        var frame = this.convertUphillToDownhill(this.getCurrentFrameNumber());
        this.sisyphus.animations.play('downhill');
        this.sisyphus.animations.currentAnim.setFrame(frame,true);
      }
    }

    if (this.timeSinceActived > this.MAX_ACTIVATED_DELAY) {
      this.activated = false;
    }

    var frame = this.getCurrentFrameNumber();
    this.sisyphusIndicator.x = this.indicatorPositions[frame].x - this.sisyphusIndicator.width/2;
    this.sisyphusIndicator.y = this.indicatorPositions[frame].y - this.sisyphusIndicator.height;

  },

  convertUphillToDownhill: function(f) {
    // return this.SISYPHUS_DOWNHILL_FRAMES.indexOf(f);

    console.log("uphill>downhill converting " + f);
    var result = this.SISYPHUS_DOWNHILL_FRAMES.indexOf(f);
    console.log("--> " + result);
    return result;

    var result = (this.SISYPHUS_UPHILL_FRAMES.length - 1 - (f - 51));

    if (result >= this.SISYPHUS_DOWNHILL_FRAMES.length) {
      result = this.SISYPHUS_DOWNHILL_FRAMES.length - 1;
    }
    if (result < 0) {
      result = 0;
    }

    console.log("--> " + result);

    return result;
  },


  convertDownhillToUphill: function(f) {
    // return this.SISYPHUS_UPHILL_FRAMES.indexOf(f);

    var result = (f - 51);
    if (result < 0) result = 0;
    if (result >= this.SISYPHUS_UPHILL_FRAMES.length) result = this.SISYPHUS_UPHILL_FRAMES.length - 1;
    return result;
  },

  getCurrentFrameNumber: function () {
    return parseInt(this.sisyphus.animations.currentAnim.currentFrame.name.slice(18,100)) - 1;
  },


  INPUT: function () {
    this.activated = true;
    this.timeSinceActived = 0;
  },

  updateTexts: function () {
    this.statText.text = "FAILURES: " + this.failures;
  },

  getAnimationArray: function (name, frames) {
    for (var i = 0; i < frames.length; i++) {
      frames[i] = name + frames[i] + '.png';
    }
    return frames;
  },

  indicatorPositions: [
    {x: 10*4, y: 58*4},
    {x: 11*4, y: 58*4},
    {x: 13*4, y: 58*4},
    {x: 15*4, y: 58*4},
    {x: 16*4, y: 58*4},
    {x: 18*4, y: 58*4},
    {x: 20*4, y: 58*4},
    {x: 21*4, y: 58*4},
    {x: 23*4, y: 58*4},
    {x: 25*4, y: 58*4},
    {x: 26*4, y: 58*4},
    {x: 28*4, y: 58*4},
    {x: 30*4, y: 58*4},
    {x: 31*4, y: 58*4},
    {x: 33*4, y: 58*4},
    {x: 35*4, y: 58*4},
    {x: 36*4, y: 58*4},
    {x: 38*4, y: 58*4},
    {x: 40*4, y: 58*4},
    {x: 41*4, y: 58*4},
    {x: 43*4, y: 58*4},
    {x: 45*4, y: 58*4},
    {x: 46*4, y: 58*4},
    {x: 48*4, y: 58*4},
    {x: 50*4, y: 58*4},
    {x: 51*4, y: 58*4},
    {x: 53*4, y: 58*4},
    {x: 55*4, y: 58*4},
    {x: 56*4, y: 58*4},
    {x: 58*4, y: 58*4},
    {x: 60*4, y: 58*4},
    {x: 61*4, y: 58*4},
    {x: 63*4, y: 58*4},
    {x: 65*4, y: 58*4},
    {x: 66*4, y: 58*4},
    {x: 68*4, y: 58*4},
    {x: 70*4, y: 58*4},
    {x: 71*4, y: 58*4},
    {x: 73*4, y: 58*4},
    {x: 75*4, y: 58*4},
    {x: 76*4, y: 58*4},
    {x: 78*4, y: 58*4},
    {x: 80*4, y: 58*4},
    {x: 81*4, y: 58*4},
    {x: 81*4, y: 58*4},
    {x: 81*4, y: 58*4},
    {x: 81*4, y: 58*4},
    {x: 81*4, y: 58*4},
    {x: 81*4, y: 58*4},
    {x: 81*4, y: 58*4},
    {x: 81*4, y: 58*4},
    {x: 81*4, y: 58*4},
    {x: 81*4, y: 58*4},
    {x: 81*4, y: 58*4},
    {x: 83*4, y: 58*4},
    {x: 85*4, y: 58*4},
    {x: 88*4, y: 58*4},
    {x: 90*4, y: 58*4},
    {x: 92*4, y: 58*4},
    {x: 93*4, y: 58*4},
    {x: 95*4, y: 58*4},
    {x: 97*4, y: 58*4},
    {x: 98*4, y: 58*4},
    {x: 100*4, y: 58*4},
    {x: 102*4, y: 56*4},
    {x: 103*4, y: 55*4},
    {x: 105*4, y: 55*4},
    {x: 106*4, y: 52*4},
    {x: 107*4, y: 51*4},
    {x: 109*4, y: 51*4},
    {x: 110*4, y: 48*4},
    {x: 111*4, y: 47*4},
    {x: 113*4, y: 47*4},
    {x: 114*4, y: 44*4},
    {x: 115*4, y: 43*4},
    {x: 117*4, y: 43*4},
    {x: 118*4, y: 40*4},
    {x: 119*4, y: 39*4},
    {x: 121*4, y: 39*4},
    {x: 122*4, y: 36*4},
    {x: 123*4, y: 35*4},
    {x: 125*4, y: 35*4},
    {x: 126*4, y: 32*4},
    {x: 127*4, y: 31*4},
    {x: 129*4, y: 31*4},
    {x: 130*4, y: 28*4},
    {x: 131*4, y: 27*4},
    {x: 133*4, y: 27*4},
    {x: 134*4, y: 24*4},
    {x: 135*4, y: 23*4},
    {x: 137*4, y: 23*4},
    {x: 138*4, y: 20*4},
    {x: 139*4, y: 19*4},
    {x: 141*4, y: 19*4},
    {x: 142*4, y: 16*4},
    {x: 143*4, y: 15*4},
  ]

};


function scale (sprite,amount) {
  sprite.anchor.x = 0;
  sprite.anchor.y = 0;
  sprite.scale.x *= amount;
  sprite.scale.y *= amount;
}
