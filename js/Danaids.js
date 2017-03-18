
BasicGame.Danaids = function (game) {

};

BasicGame.Danaids.prototype = {

  STATE: {
    BETWEEN: "BETWEEN",
    FILLING: "FILLING",
    DONE_FILLING: 'DONE_FILLING',
    TO_FILL: "TO_FILL",
    TO_POUR: "TO_POUR",
    POURING: "POURING",
    IDLE: "IDLE",
    BATH_DRAINING: "BATH_DRAINING"
  },

  showInstructions: true,

  state: null,

  MAX_ACTIVATION_DELAY: 150,
  timeSinceActivation: 100000,
  FILL_TIME: 2000,
  bathFullPercentage: 0,
  fillTime: 0,

  activated: true,

  create: function () {

    this.state = this.STATE.TO_FILL;

    this.stage.backgroundColor = 0xDDDDAA;

    // SPRITES

    this.TAP_STOP_X = 8.25*SCALE;
    this.BATH_STOP_X = 165.25*SCALE;

    // TAP
    this.tap = this.add.sprite(0*SCALE,61*SCALE,'atlas');
    this.tap.animations.add('idle',this.getAnimationArray('danaids/tap_',[1,2,3]), 5, true);
    this.tap.animations.add('bucket',this.getAnimationArray('danaids/tap_',[4]), 5, false);
    this.tap.animations.add('bucket_removed',this.getAnimationArray('danaids/tap_',[5,6]), 5, false);
    scale(this.tap,4);

    this.tap.animations.play('idle');

    // DANAID
    this.danaid = this.add.sprite(50*SCALE,60*SCALE,'atlas');
    this.danaid.animations.add('idle',this.getAnimationArray('danaids/danaid_',[4]), 5, false);
    this.danaid.animations.add('running',this.getAnimationArray('danaids/danaid_',[1,2,3]), 5, true);
    this.danaid.animations.add('filling',this.getAnimationArray('danaids/danaid_',[6]), 5, false);
    this.danaid.animations.add('unfilling',this.getAnimationArray('danaids/danaid_',[5]), 5, false);
    this.danaid.animations.add('pouring',this.getAnimationArray('danaids/danaid_',[5,6,7,8,9,10,10,10,10,10,9,8,7,6,5]), 5, false);
    scale(this.danaid,4);
    this.danaid.anchor.x = 0.5;
    this.danaid.scale.x *= -1

    this.danaid.animations.play('idle');

    this.bath = this.add.sprite(170*SCALE,67*SCALE,'atlas');
    this.bath.animations.add('idle',this.getAnimationArray('danaids/bath_',[1]), 5, false);
    this.bath.animations.add('pouring',this.getAnimationArray('danaids/bath_',[1,2,3]), 5, false);
    this.bath.animations.add('draining',this.getAnimationArray('danaids/bath_',[4,5,6,7,8,1]), 5, false);
    scale(this.bath,4);

    this.bath.animations.play('idle');

    this.ground = this.add.sprite(0*SCALE,0*SCALE,'atlas','danaids/ground.png');
    scale(this.ground,4);


    // SFX

    this.bathFillSFX = this.game.add.audio('swoopupSFX');
    this.bathEmptySFX = this.game.add.audio('swoopdownSFX');


    // TEXTS

    // INSTRUCTIONS
    var instructionsString = "RAPIDLY CALL THE INPUT() FUNCTION TO FILL YOUR BUCKET AND THEN FILL THE BATH TO WASH AWAY YOUR SINS!";
    var instructionsStyle = { font: FONT_SIZE_SMALL + "px commodore_64_pixelizedregular", fill: "#000000", lineHeight: 2, wordWrap: true, wordWrapWidth: this.game.width - 400, align: "center"};
    this.instructionsText = this.game.add.text(this.game.width/2, 20*4, instructionsString, instructionsStyle);
    this.instructionsText.lineSpacing = -8;
    this.instructionsText.anchor.x = 0.5;

    var statStyle = { font: FONT_SIZE_SMALL + "px commodore_64_pixelizedregular", fill: "#ffffff", lineHeight: 2, wordWrap: true, wordWrapWidth: this.game.width - 400, align: "center"};
    this.bathText = this.game.add.text(118*SCALE,87*SCALE, 'BATH FULL: 0%', statStyle);

    this.updateTexts();


    // CPU PLAYER
    var context = this;
    setInterval(function () {
      context.INPUT();
    },100);

  },

  update: function () {

    this.timeSinceActivation += this.time.elapsed;

    if (this.activated) {
      if (this.state == this.STATE.DONE_FILLING) {
        this.state = this.STATE.IDLE;
        this.danaid.animations.play("unfilling");
        this.tap.animations.play("idle");
        this.time.events.add(1000,this.fillToPour,this);
      }
      else if (this.state == this.STATE.FILLING) {
        this.fillTime += this.time.elapsed;
        if (this.fillTime < this.FILL_TIME) {
          this.danaid.animations.play("filling");
          this.tap.animations.play("bucket");
        }
        else {
          this.fillTime = 0;
          this.state = this.STATE.DONE_FILLING;
        }
      }
      else if (this.state == this.STATE.TO_FILL) {
        this.danaid.animations.play("running");
        this.danaid.x -= 0.3*SCALE;
      }
      else if (this.state == this.STATE.TO_POUR) {
        this.danaid.animations.play("running");
        this.danaid.x += 0.3*SCALE;
      }

    }
    else {
      if (this.state != this.STATE.POURING) {
        this.danaid.animations.play("idle");
        this.tap.animations.play("idle");
      }
    }

    if (this.state == this.STATE.POURING) {
      if (this.danaid.animations.currentAnim.frame == 9 && !this.bathFilling) {
        this.bathFilling = true;
        this.bath.animations.play("pouring");
        this.bathFillSFX.play();
      }
      if (this.danaid.animations.currentAnim.frame == 9 && this.bathFullPercentage < 20) {
        this.bathFullPercentage += 1;
        this.updateTexts();
      }
      if (this.danaid.animations.currentAnim.isFinished) {
        this.instructionsText.visible = false;
        this.bathFilling = false;
        this.state = this.STATE.BATH_DRAINING;
        this.bath.animations.play("draining");
        this.bathEmptySFX.play();
        this.time.events.add(1000,this.pourToFill,this);
      }
    }
    if (this.tap.animations.currentAnim.isFinished && this.state == this.STATE.IDLE) {
      this.tap.animations.play("idle");
    }
    if (this.state == this.STATE.BATH_DRAINING && this.bathFullPercentage > 0) {
      this.bathFullPercentage -= 1;
      this.updateTexts();
    }

    if (this.danaid.x <= this.TAP_STOP_X && this.state != this.STATE.FILLING && this.state != this.STATE.IDLE && this.state != this.STATE.DONE_FILLING) {
      this.state = this.STATE.FILLING;
      this.danaid.animations.play("filling");
      this.tap.animations.play("bucket");
    }
    else if (this.danaid.x >= this.BATH_STOP_X && this.state != this.STATE.POURING && this.state != this.STATE.IDLE && this.state != this.STATE.BATH_DRAINING && this.state != this.STATE.TO_FILL) {
      this.state = this.STATE.POURING;
      this.danaid.animations.play("pouring");
    }

    if (this.timeSinceActivation > this.MAX_ACTIVATION_DELAY) {
      this.activated = false;
    }
  },

  fillToPour: function () {
    this.danaid.scale.x *= -1;
    this.danaid.x += 4*SCALE;
    this.state = this.STATE.TO_POUR;
  },


  pourToFill: function () {
    this.danaid.scale.x *= -1;
    this.danaid.x -= 4*SCALE;
    this.state = this.STATE.TO_FILL;
  },

  updateTexts: function () {
    this.bathText.text = "BATH FULL: " + this.bathFullPercentage + "%";
  },

  INPUT: function () {
    this.activated = (this.timeSinceActivation <= this.MAX_ACTIVATION_DELAY);
    this.timeSinceActivation = 0;
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
