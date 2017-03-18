BasicGame.Prometheus = function (game) {

};

BasicGame.Prometheus.prototype = {

  DAY_STATE: {
    DAY: "DAY",
    END_OF_DAY: "END_OF_DAY",
    DAY2NIGHT: 'DAY2NIGHT',
    NIGHT: "NIGHT",
    NIGHT2DAY: "NIGHT2DAY"
  },

  EAGLE_STATE: {
    PRE_ARRIVAL: "PRE_ARRIVAL",
    ARRIVING: "ARRIVING",
    PERCHED: "PERCHED",
    PECKING: "PECKING",
    FLAP_UP: "FLAP_UP",
    HOVER: "HOVER",
    FLAP_DOWN: "FLAP_DOWN",
    PRE_DEPARTURE: "PRE_DEPARTURE",
    DEPARTING: "DEPARTING",
    DEPARTED: "DEPARTED",
    GONE: "GONE"
  },

  showInstructions: true,

  EAGLE_LAND_Y: 50,
  EAGLE_FLAP_HEIGHT: 40,

  postEagleDepartureDelay: 2,
  nightDuration: 10,
  chainedNightDuration: 5,
  dayDuration: 10,

  LIVER_DAMAGE: 5,
  liver: 100,
  days: 0,

  peckSFX: null,
  liverSFX: null,

  dayState: null,


  create: function () {

    this.dayState = this.DAY_STATE.DAY;


    // SPRITES

    // BG
    this.bg = this.add.sprite(0,0,'atlas');
    this.bg.animations.add('daytime',Phaser.Animation.generateFrameNames('prometheus/bg_', 1, 1, '.png'), 5, false);
    this.bg.animations.add('nighttime',Phaser.Animation.generateFrameNames('prometheus/bg_', 2, 2, '.png'), 5, false);
    scale(this.bg,400);

    this.bg.animations.play('daytime');

    // PROMETHEUS
    this.prometheus = this.add.sprite(360,220,'atlas');
    this.prometheus.animations.add('idle',Phaser.Animation.generateFrameNames('prometheus/prometheus_', 1, 1, '.png'), 5, false);
    this.prometheus.animations.add('struggle',this.getAnimationArray('prometheus/prometheus_',[2,1]), 5, false);
    this.prometheus.animations.add('nighttime',Phaser.Animation.generateFrameNames('prometheus/prometheus_', 3, 3, '.png'), 5, false);
    scale(this.prometheus,4);

    this.prometheus.animations.play('idle');

    // ROCK (AND CHAINS)
    this.rock = this.add.sprite(0,0,'atlas');
    this.rock.animations.add('daytime',Phaser.Animation.generateFrameNames('prometheus/rock_', 1, 1, '.png'), 5, false);
    this.rock.animations.add('nighttime',Phaser.Animation.generateFrameNames('prometheus/rock_', 2, 2, '.png'), 5, false);
    scale(this.rock,4);

    this.rock.animations.play('daytime');

    // EAGLE
    this.eagle = this.add.sprite(22*SCALE,-20*SCALE,'atlas');
    this.eagle.animations.add('flying',Phaser.Animation.generateFrameNames('prometheus/eagle_', 1, 4, '.png'), 5, true);
    this.eagle.animations.add('perched',Phaser.Animation.generateFrameNames('prometheus/eagle_', 5, 5, '.png'), 5, false);
    this.eagle.animations.add('peck',this.getAnimationArray('prometheus/eagle_', [6]), 10, false);
    scale(this.eagle,4);

    this.eagle.animations.play('flying');

    // SFX
    this.peckSFX = this.game.add.audio('peckSFX');
    this.liverSFX = this.game.add.audio('swoopdownSFX');


    // TEXTS

    // INSTRUCTIONS
    var instructionsString = "RAPIDLY CALL THE INPUT() FUNCTION TO WRITHE IN PAIN AND DISLODGE THE EAGLE!";
    var instructionsStyle = { font: 24 + "px commodore_64_pixelizedregular", fill: "#000000", lineHeight: 2, wordWrap: true, wordWrapWidth: this.game.width - 400, align: "center"};
    this.instructionsText = this.game.add.text(this.game.width/2, 20*4, instructionsString, instructionsStyle);
    this.instructionsText.lineSpacing = -8;
    this.instructionsText.anchor.x = 0.5;

    var statStyle = { font: FONT_SIZE_BIG + "px commodore_64_pixelizedregular", fill: "#000000", lineHeight: 2, wordWrap: true, wordWrapWidth: this.game.width - 400, align: "center"};
    this.liverText = this.game.add.text(15*4, 60*4, 'LIVER: 100%', statStyle);
    this.daysText = this.game.add.text(125*4, 60*4, 'DAYS: 0', statStyle);

    this.updateTexts();


    // START THE GAME

    this.eagleArrivalEvent = this.game.time.events.add(Phaser.Timer.SECOND * 2, function () {
      this.eagle.state = this.EAGLE_STATE.ARRIVING;
    }, this);


    // CPU PLAYER

    context = this;
    setInterval(function () {
      context.INPUT();
    },1000);

  },

  update: function () {
    this.handleEagle();
    this.handleDayNight();
    this.handleInput();
  },


  handleEagle: function () {
    switch (this.eagle.state) {
      case this.EAGLE_STATE.PRE_ARRIVAL:
      this.eagle.animations.play('flying');
      break;

      case this.EAGLE_STATE.ARRIVING:
      if (this.eagle.y < this.EAGLE_LAND_Y*SCALE) {
        this.moveEagle(1,1);
      }
      else {
        this.eagle.state = this.EAGLE_STATE.PERCHED;
        this.eagle.play("perched");
        this.cuePeck();
      };

      break;

      case this.EAGLE_STATE.PERCHED:
      if (this.liver == 0) {
        if (this.peckEvent) {
          this.game.time.events.remove(this.peckEvent);
        }
        this.eagle.state = this.EAGLE_STATE.PRE_DEPARTURE;
        this.departingEvent = this.game.time.events.add(Phaser.Timer.SECOND * 2, function () {
          this.eagle.state = this.EAGLE_STATE.DEPARTING;
          this.eagle.animations.play("flying");
        },this);
      }

      break;

      case this.EAGLE_STATE.PRE_DEPARTURE:

      break;

      case this.EAGLE_STATE.FLAP_UP:
      this.moveEagle(0,-1);
      if (this.eagle.y <= this.EAGLE_FLAP_HEIGHT*SCALE) {
        this.eagle.state = this.EAGLE_STATE.HOVER;
        var hoverTime = Phaser.Timer.SECOND * Math.random() * 3;
        this.hoverEvent = this.game.time.events.add(hoverTime, function () {
          this.eagle.state = this.EAGLE_STATE.FLAP_DOWN;
          this.instructionsText.visible = false;
        },this);
      }

      break;

      case this.EAGLE_STATE.HOVER:

      break;

      case this.EAGLE_STATE.FLAP_DOWN:
      if (this.eagle.y < this.EAGLE_LAND_Y*SCALE) {
        this.moveEagle(0,1);
      }
      else {
        this.eagle.state = this.EAGLE_STATE.PERCHED;
        this.eagle.play("perched");
        this.cuePeck();
      };

      break;

      case this.EAGLE_STATE.DEPARTING:
      if (this.eagle.y > -10*SCALE) {
        this.moveEagle(1,-1);
      }
      else {
        this.eagle.state = this.EAGLE_STATE.DEPARTED;
      }

      break;

      case this.EAGLE_STATE.DEPARTED:

      break;
    }
  },

  handleDayNight: function () {
    switch (this.dayState) {

      case this.DAY_STATE.DAY:
      if (this.eagle.state == this.EAGLE_STATE.DEPARTED) {
        this.game.time.events.add(Phaser.Timer.SECOND * this.postEagleDepartureDelay,function () {
          this.dayState = this.DAY_STATE.DAY2NIGHT;
        },this);
        this.dayState = this.DAY_STATE.END_OF_DAY;
      }
      break;

      case this.DAY_STATE.END_OF_DAY:

      break;

      case this.DAY_STATE.DAY2NIGHT:
      this.liverText.visible = false;
      this.daysText.visible = false;
      this.instructionsText.visible = false;

      this.bg.play('nighttime');
      this.rock.play('nighttime');
      this.prometheus.play('nighttime');

      this.game.time.events.add(Phaser.Timer.SECOND * this.chainedNightDuration,function() {
        this.dayState = this.DAY_STATE.NIGHT2DAY;
      },this);
      this.dayState = this.DAY_STATE.NIGHT;

      break;

      case this.DAY_STATE.NIGHT:

      break;

      case this.DAY_STATE.NIGHT2DAY:

      this.prometheus.play('idle');
      this.rock.play('daytime');
      this.bg.play('daytime');

      this.eagleArrivalEvent = this.game.time.events.add(Phaser.Timer.SECOND * 2, function () {
        this.eagle.state = this.EAGLE_STATE.ARRIVING;
      }, this);

      this.liverText.visible = true;
      this.daysText.visible = true;
      if (this.showInstructions) this.instructionsText.visible = true;

      this.dayState = this.DAY_STATE.DAY;

      if (this.liver != 100) this.liverSFX.play();
      this.liver = 100;
      this.days++;
      this.updateTexts();

      this.eagle.state = this.EAGLE_STATE.PRE_ARRIVAL;
      this.eagle.animations.play('flying');
      this.eagle.x = 22*SCALE;
      this.eagle.y = -20*SCALE;
      this.eagleArrivalEvent = this.game.time.events.add(Phaser.Timer.SECOND * 2, function () {
        this.eagle.state = this.EAGLE_STATE.ARRIVING;
      }, this);

      break;

    }
  },

  handleInput: function () {
    // ha ha
  },

  INPUT: function () {

    if (this.liver == 0) return;

    this.showInstructions = false;

    this.prometheus.animations.play("struggle");
    if (this.eagle.state == this.EAGLE_STATE.PERCHED) {
      this.eagle.state = this.EAGLE_STATE.FLAP_UP;
      this.eagle.animations.play('flying');
      if (this.peckEvent) {
        this.game.time.events.remove(this.peckEvent);
      }
    }
  },

  moveEagle: function (xFactor, yFactor) {
    this.eagle.x += xFactor*0.3*SCALE;
    this.eagle.y += yFactor*0.3*SCALE;
  },

  cuePeck: function () {
    this.peckEvent = this.game.time.events.add(Phaser.Timer.SECOND * (Math.random() * 2 + 1), this.peck, this);
  },

  peck: function () {
    this.eagle.state = this.EAGLE_STATE.PECKING;
    this.eagle.animations.play("peck");
    this.peckSFX.play();
    this.liver -= this.LIVER_DAMAGE;
    this.eagle.animations.currentAnim.onComplete.addOnce(function (){
      this.updateTexts();
      this.eagle.state = this.EAGLE_STATE.PERCHED;
      this.eagle.play("perched");
      this.cuePeck();
    },this);
  },


  updateTexts: function () {
    this.liverText.text = "LIVER: " + this.liver + "%";
    this.daysText.text = "DAYS: " + this.days;
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
