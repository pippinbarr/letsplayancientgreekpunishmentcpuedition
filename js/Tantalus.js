BasicGame.Tantalus = function (game) {

};

BasicGame.Tantalus.prototype = {

  IDLE_FRAMES: [0,0],
  REACH_FRAMES: [1,2,3,4],
  REACH_LOOP: [5,6],
  UNREACH_FRAMES: [4,3,2,1],
  STOOP_FRAMES: [7,8,9,10,11],
  STOOP_LOOP: [12,13],
  UNSTOOP_FRAMES: [11,10,9,8,7],

  STATE: {
    IDLE: 'IDLE',
		REACHING: 'REACHING',
		REACHLOOP: 'REACHLOOP',
		UNREACHING: 'UNREACHING',
		STOOPING: 'STOOPING',
		STOOPLOOP: 'STOOPLOOP',
		UNSTOOPING: 'UNSTOOPING',
  },

  fruits: 0,
  waters: 0,
  state: undefined,
  activated: false,
  timeSinceActived: 10000,
  MAX_ACTIVATED_DELAY: 120,

  create: function () {

    this.stage.backgroundColor = '#AAFFAA';

    this.state = this.STATE.IDLE;

    // SPRITES

    // TANTALUS
    this.tantalus = this.add.sprite(0,0,'atlas');
    this.tantalus.animations.add('idle',this.getAnimationArray('tantalus/tantalus_',this.IDLE_FRAMES),5,false);
    this.tantalus.animations.add('reach',this.getAnimationArray('tantalus/tantalus_',this.REACH_FRAMES),5,false);
    this.tantalus.animations.add('reachLoop',this.getAnimationArray('tantalus/tantalus_',this.REACH_LOOP),5,true);
    this.tantalus.animations.add('unreach',this.getAnimationArray('tantalus/tantalus_',this.UNREACH_FRAMES),5,false);
    this.tantalus.animations.add('stoop',this.getAnimationArray('tantalus/tantalus_',this.STOOP_FRAMES),5,false);
    this.tantalus.animations.add('stoopLoop',this.getAnimationArray('tantalus/tantalus_',this.STOOP_LOOP),5,true);
    this.tantalus.animations.add('unstoop',this.getAnimationArray('tantalus/tantalus_',this.UNSTOOP_FRAMES),5,false);
    scale(this.tantalus,8);

    this.tantalus.animations.play('idle');


    // SFX
    this.failureSFX = this.game.add.audio('peckSFX');
    this.downhillSFX = this.game.add.audio('swoopdownSFX');


    // TEXTS

    // INSTRUCTIONS
    var fruitInstructionsStyle = { font: 24 + "px commodore_64_pixelizedregular", fill: "#000000", lineHeight: 2, wordWrap: true, wordWrapWidth: 350, align: "center"};
    var waterInstructionsStyle = { font: 24 + "px commodore_64_pixelizedregular", fill: "#FFFFFF", lineHeight: 2, wordWrap: true, wordWrapWidth: 250, align: "center"};

    var fruitInstructionsString = "RAPIDLY CALL THE INPUT1() FUNCTION TO TO TAKE THE FRUIT!";
    this.fruitInstructionsText = this.game.add.text(110*4,20*4, fruitInstructionsString, fruitInstructionsStyle);
    this.fruitInstructionsText.lineSpacing = -8;

    var waterInstructionsString = "RAPIDLY CALL THE INPUT2() FUNCTION TO DRINK THE WATER!";
    this.waterInstructionsText = this.game.add.text(2*4,65*4, waterInstructionsString, waterInstructionsStyle);
    this.waterInstructionsText.lineSpacing = -8;

    var fruitStatStyle = { font: FONT_SIZE_BIG + "px commodore_64_pixelizedregular", fill: "#000000", lineHeight: 2, wordWrap: true, wordWrapWidth: this.game.width - 400, align: "center"};
    var waterStatStyle = { font: FONT_SIZE_BIG + "px commodore_64_pixelizedregular", fill: "#ffffff", lineHeight: 2, wordWrap: true, wordWrapWidth: this.game.width - 400, align: "center"};
    this.fruitStatText = this.game.add.text(40*4, 5*4, 'FRUIT: 0', fruitStatStyle);
    this.fruitStatText.angle = 32;
    this.waterStatText = this.game.add.text(75*4, 85*4, 'WATER: 0', waterStatStyle);


    this.updateTexts();


    // CPU PLAYER

    context = this;
    setInterval(function () {
      context.INPUT1();
    },100);

    // this.input.onDown.add(this.onDown,this);

  },

  onDown: function () {
    this.INPUT();
  },

  update: function () {

    return;
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
    return this.SISYPHUS_UPHILL_FRAMES.indexOf(f);

    var result = (f - 51);
    if (result < 0) result = 0;
    if (result >= this.SISYPHUS_UPHILL_FRAMES.length) result = this.SISYPHUS_UPHILL_FRAMES.length - 1;
    return result;
  },

  getCurrentFrameNumber: function () {
    return parseInt(this.sisyphus.animations.currentAnim.currentFrame.name.slice(18,100)) - 1;
  },


  INPUT1: function () {
    this.activated = true;
    this.timeSinceActived = 0;
  },

  updateTexts: function () {
    this.fruitStatText.text = "FRUIT: " + this.fruits;
    this.waterStatText.text = "WATER: " + this.waters;
  },

  getAnimationArray: function (name, frames) {
    for (var i = 0; i < frames.length; i++) {
      frames[i] = name + (frames[i]+1) + '.png';
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
