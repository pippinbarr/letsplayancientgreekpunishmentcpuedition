
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

  bathFullPercentage: 0,

  create: function () {

    this.state = this.STATE.IDLE;

    this.stage.backgroundColor = 0xDDDDAA;

    // SPRITES

    // DANAID
    this.danaid = this.add.sprite(50*SCALE,60*SCALE,'atlas');
    this.danaid.animations.add('idle',this.getAnimationArray('danaids/danaid_',[4]), 5, false);
    this.danaid.animations.add('running',this.getAnimationArray('danaids/danaid_',[1,2,3]), 5, true);
    this.danaid.animations.add('filling',this.getAnimationArray('danaids/danaid_',[6]), 5, false);
    this.danaid.animations.add('unfilling',this.getAnimationArray('danaids/danaid_',[5]), 5, false);
    this.danaid.animations.add('pouring',this.getAnimationArray('danaids/danaid_',[5,6,7,8,9,10,10,10,10,10,9,8,7,6,5]), 5, false);
    scale(this.danaid,4);

    this.danaid.animations.play('idle');

    this.tap = this.add.sprite(0*SCALE,61*SCALE,'atlas');
    this.tap.animations.add('idle',this.getAnimationArray('danaids/tap_',[1,2,3]), 5, true);
    this.tap.animations.add('bucket',this.getAnimationArray('danaids/tap_',[4]), 5, false);
    this.tap.animations.add('bucket_removed',this.getAnimationArray('danaids/tap_',[5,6]), 5, false);
    scale(this.tap,4);

    this.tap.animations.play('idle');

    this.bath = this.add.sprite(170*SCALE,67*SCALE,'atlas');
    this.bath.animations.add('idle',this.getAnimationArray('danaids/bath_',[1]), 5, false);
    this.bath.animations.add('pouring',this.getAnimationArray('danaids/bath_',[1,2,3]), 5, false);
    this.bath.animations.add('draining',this.getAnimationArray('danaids/bath_',[4,5,6,7,8,1]), 5, false);
    scale(this.bath,4);

    this.bath.animations.play('idle');

    this.ground = this.add.sprite(0*SCALE,0*SCALE,'atlas','danaids/ground.png');
    scale(this.ground,4);


    // SFX

    this.bathFillSFX = this.game.add.audio('swoopdownSFX');
    this.bathEmptySFX = this.game.add.audio('swoopupSFX');


    // TEXTS

    // INSTRUCTIONS
    var instructionsString = "RAPIDLY CALL THE DANAID() FUNCTION TO FILL YOUR BUCKET AND THEN FILL THE BATH TO WASH AWAY YOUR SINS!";
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
      // context.danaid();
    },1000);

  },

  update: function () {
    switch (this.state) {
      case this.STATE.BETWEEN:
      break;

      case this.STATE.FILLING:
      break;

      case this.STATE.DONE_FILLING:
      break;

      case this.STATE.TO_FILL:
      break;

      case this.STATE.TO_POUR:
      break;

      case this.STATE.POURING:
      break;

      case this.STATE.IDLE:
      break;

      case this.STATE.BATH_DRAINING:
      break;

    }
  },

  updateTexts: function () {
    this.bathText.text = "BATH FULL: " + this.bathFullPercentage + "%";
  },

  danaid: function () {
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
