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
  input: 0,
  inputChoice: 0,
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
    this.failureSFX = this.game.add.audio('swoopdownSFX');
    this.attemptSFX = this.game.add.audio('swoopupSFX');


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



    context = this;
    this.inputChoice = (Math.random() > 0.5 ? 1 : 2);
    setInterval(function () {
      if (context.inputChoice == 1) {
        context.INPUT1();
      }
      else {
        context.INPUT2();
      }
    },100);

    // this.input.onDown.add(this.onDown,this);

  },

  onDown: function (e) {
    if (e.y > this.game.canvas.height/2) {
      // console.log("low");
      this.INPUT2();
    }
    else {
      // console.log("high");
      this.INPUT1();
    }
  },

  update: function () {

    this.timeSinceActived += this.time.elapsed;

    this.handleSFX();
    this.handleAnimationTransitions();
    this.handleInputAnimations();

    if (this.timeSinceActived > this.MAX_ACTIVATED_DELAY) {
      this.activated = false;
      this.input = 0;
    }
  },

  handleSFX () {
    var animName = this.tantalus.animations.currentAnim.name;
    var currentFrame = this.getCurrentFrameNumber();
    // if (this.state == this.STATE.REACHING && this.getCurrentFrameNumber() == 3) {
    if (animName == "reach" && currentFrame == 3) {
      this.attemptSFX.play();
    }
    // if (this.state == this.STATE.UNREACHING && this.getCurrentFrameNumber() == 4) {
    if (animName == "unreach" && currentFrame == 4) {
      this.failureSFX.play();
    }
    // if (this.state == this.STATE.STOOPING && this.getCurrentFrameNumber() == 9) {
    if (animName == "stoop" && currentFrame == 9) {
      this.failureSFX.play();
    }
    // if (this.state == this.STATE.UNSTOOPING && this.getCurrentFrameNumber() == 9) {
    if (animName == "unstoop" && currentFrame == 9) {
      this.attemptSFX.play();
    }
  },

  handleAnimationTransitions: function () {
    if (this.state == this.STATE.REACHING && this.tantalus.animations.currentAnim.isFinished) {
      // console.log("REACHING>REACHLOOP")
      this.state = this.STATE.REACHLOOP;
      this.tantalus.animations.play("reachLoop");
      if (this.fruitInstructionsText.visible) {
        this.fruitInstructionsText.visible = false
      }

    }
    else if (this.state == this.STATE.UNREACHING && this.tantalus.animations.currentAnim.isFinished) {
      // console.log("UNREACHING>IDLE");
      this.state = this.STATE.IDLE;
      this.tantalus.animations.play("idle");
    }
    else if (this.state == this.STATE.STOOPING && this.tantalus.animations.currentAnim.isFinished) {
      // console.log("STOOPING>STOOPLOOP");
      this.state = this.STATE.STOOPLOOP;
      this.tantalus.animations.play("stoopLoop");
      if (this.waterInstructionsText.visible) {
        this.waterInstructionsText.visible;
      }
    }
    else if (this.state == this.STATE.UNSTOOPING && this.tantalus.animations.currentAnim.isFinished) {
      // console.log("UNSTOOPING>IDLE");
      this.state = this.STATE.IDLE;
      this.tantalus.animations.play("idle");
    }
  },

  handleInputAnimations: function () {
    if (this.activated && this.input == 1) {
      if (this.state == this.STATE.IDLE) {
        // console.log("IDLE>REACHING");
        // console.log(this.tantalus.animations.currentAnim);
        this.state = this.STATE.REACHING;
        this.tantalus.animations.play("reach");
      }
      else if (this.state == this.STATE.UNREACHING) {
        // console.log("UNREACHING>REACHING");
        // console.log(this.tantalus.animations.currentAnim);
        this.state = this.STATE.REACHING;
        var frame = this.unreachToReach(this.getCurrentFrameNumber());
        this.tantalus.animations.play('reach');
        this.tantalus.animations.currentAnim.setFrame(frame,true);
      }
      else if (this.state == this.STATE.STOOPING) {
        // console.log("STOOPING>UNSTOOPING");
        // console.log(this.tantalus.animations.currentAnim);
        this.state = this.STATE.UNSTOOPING;
        var frame = this.stoopToUnstoop(this.getCurrentFrameNumber());
        this.tantalus.animations.play('unstoop');
        this.tantalus.animations.currentAnim.setFrame(frame,true);
      }
      else if (this.state == this.STATE.STOOPLOOP) {
        // console.log("STOOPLOOP>UNSTOOPING");
        // console.log(this.tantalus.animations.currentAnim);
        this.state = this.STATE.UNSTOOPING;
        this.tantalus.animations.play("unstoop");
      }
    }
    else if (this.activated && this.input == 2) {
      if (this.state == this.STATE.IDLE) {
        // console.log("IDLE>STOOPING");
        // console.log(this.tantalus.animations.currentAnim);
        this.state = this.STATE.STOOPING;
        this.tantalus.animations.play("stoop");
      }
      else if (this.state == this.STATE.UNSTOOPING) {
        // console.log("UNSTOOPING>STOOPING");
        // console.log(this.tantalus.animations.currentAnim);
        this.state = this.STATE.STOOPING;
        var frame = this.unstoopToStoop(this.getCurrentFrameNumber());
        this.tantalus.animations.play('stoop');
        this.tantalus.animations.currentAnim.setFrame(frame,true);
      }
      else if (this.state == this.STATE.REACHING) {
        // console.log("REACHING>UNREACHING");
        // console.log(this.tantalus.animations.currentAnim);
        this.state = this.STATE.UNREACHING;
        var frame = this.reachToUnreach(this.getCurrentFrameNumber());
        this.tantalus.animations.play('unreach');
        this.tantalus.animations.currentAnim.setFrame(frame,true);
      }
      else if (this.state == this.STATE.REACHLOOP) {
        // console.log("REACHLOOP>UNREACHING");
        // console.log(this.tantalus.animations.currentAnim);
        this.state = this.STATE.UNREACHING;
        this.tantalus.animations.play("unreach");
      }
    }
    else {
      if (this.state == this.STATE.REACHING) {
        // console.log("REACHING>UNREACHING");
        // console.log(this.tantalus.animations.currentAnim);
        // console.log(this.getCurrentFrameNumber());
        this.state = this.STATE.UNREACHING;
        var frame = this.reachToUnreach(this.getCurrentFrameNumber());
        this.tantalus.animations.play('unreach');
        this.tantalus.animations.currentAnim.setFrame(frame,true);
        // console.log(">");
        // console.log(this.tantalus.animations.currentAnim);
      }
      else if (this.state == this.STATE.REACHLOOP) {
        // console.log("REACHLOOP>UNREACHING");
        // console.log(this.tantalus.animations.currentAnim);
        this.state = this.STATE.UNREACHING;
        this.tantalus.animations.play("unreach");
      }
      else if (this.state == this.STATE.STOOPING) {
        // console.log("STOOPING>UNSTOOPING");
        // console.log(this.tantalus.animations.currentAnim);
        this.state = this.STATE.UNSTOOPING;
        var frame = this.stoopToUnstoop(this.getCurrentFrameNumber());
        this.tantalus.animations.play('unstoop');
        this.tantalus.animations.currentAnim.setFrame(frame,true);
      }
      else if (this.state == this.STATE.STOOPLOOP) {
        // console.log("STOOPLOOP>UNSTOOPING");
        // console.log(this.tantalus.animations.currentAnim);
        this.state = this.STATE.UNSTOOPING;
        this.tantalus.animations.play("unstoop");
      }
    }

  },

  reachToUnreach: function (f) {
    // console.log("reachToUnreach",f);
    // console.log("UNREACH_FRAMES",this.UNREACH_FRAMES);
    var result = this.UNREACH_FRAMES.indexOf(f);
    // console.log("reachToUnread returning",result);
    return result;
  },

  unreachToReach: function (f) {
    var result = this.REACH_FRAMES.indexOf(f);
    return result;

  },

  stoopToUnstoop: function (f) {
    var result = this.UNSTOOP_FRAMES.indexOf(f);
    return result;
  },

  unstoopToStoop(f) {
    var result = this.STOOP_FRAMES.indexOf(f);
    return result;
  },

  getCurrentFrameNumber: function (){
    if (!this.tantalus.animations.currentAnim.currentFrame) {
      // return undefined;
    }
    // console.log(this.tantalus.animations.currentAnim)
    // console.log(parseInt(this.tantalus.animations.currentAnim.currentFrame.name.slice(18,100)) - 1);
    return parseInt(this.tantalus.animations.currentAnim.currentFrame.name.slice(18,100)) - 1;
  },


  INPUT1: function () {
    this.activated = true;
    this.input = 1;
    this.timeSinceActived = 0;
  },

  INPUT2: function () {
    this.activated = true;
    this.input = 2;
    this.timeSinceActived = 0;
  },

  updateTexts: function () {
    this.fruitStatText.text = "FRUIT: " + this.fruits;
    this.waterStatText.text = "WATER: " + this.waters;
  },

  getAnimationArray: function (name,frames) {
    var newFrames = new Array(frames.lenth);
    for (var i = 0; i < frames.length; i++) {
      newFrames[i] = name + (frames[i]+1) + '.png';
    }
    return newFrames;
  },

};


function scale (sprite,amount) {
  sprite.anchor.x = 0;
  sprite.anchor.y = 0;
  sprite.scale.x *= amount;
  sprite.scale.y *= amount;
}
