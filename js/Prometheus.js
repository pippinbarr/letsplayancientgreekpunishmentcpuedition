const FONT_SIZE_BIG = 32;
const FONT_SIZE_SMALL = 23;
const FONT_SIZE_EXTRA_SMALL = 18;
var INPUT_WORD;


BasicGame.Prometheus = function (game) {

};

BasicGame.Prometheus.prototype = {

  create: function () {

    // Set up input description based on platform
    if (this.game.device.desktop) {
      INPUT_WORD = "ALTERNATE THE 'G' AND 'H' KEYS"
    }
    else {
      INPUT_WORD = "TAP"
    }

    // SPRITES

    // BG
    this.bg = this.add.sprite(0,0,'atlas');
    this.bg.animations.add('day',Phaser.Animation.generateFrameNames('prometheus/bg_', 1, 1, '.png'), 5, true);
    this.bg.animations.add('night',Phaser.Animation.generateFrameNames('prometheus/bg_', 2, 2, '.png'), 5, true);
    scale(this.bg,400);

    this.bg.animations.play('day');

    // PROMETHEUS
    this.prometheus = this.add.sprite(360,220,'atlas');
    this.prometheus.animations.add('idle',Phaser.Animation.generateFrameNames('prometheus/prometheus_', 1, 1, '.png'), 5, true);
    this.prometheus.animations.add('struggle',Phaser.Animation.generateFrameNames('prometheus/prometheus_', 1, 2, '.png'), 5, true);
    this.prometheus.animations.add('nighttime',Phaser.Animation.generateFrameNames('prometheus/prometheus_', 3, 3, '.png'), 5, true);
    scale(this.prometheus,4);

    this.prometheus.animations.play('idle');

    // ROCK (AND CHAINS)
    this.rock = this.add.sprite(0,0,'atlas');
    this.rock.animations.add('day',Phaser.Animation.generateFrameNames('prometheus/rock_', 1, 1, '.png'), 5, true);
    this.rock.animations.add('night',Phaser.Animation.generateFrameNames('prometheus/rock_', 2, 2, '.png'), 5, true);
    scale(this.rock,4);

    this.rock.animations.play('day');

    // EAGLE
    this.eagle = this.add.sprite(100,100,'atlas');
    this.eagle.animations.add('flying',Phaser.Animation.generateFrameNames('prometheus/eagle_', 1, 4, '.png'), 5, true);
    this.eagle.animations.add('perched',Phaser.Animation.generateFrameNames('prometheus/eagle_', 5, 5, '.png'), 5, true);
    this.eagle.animations.add('peck',Phaser.Animation.generateFrameNames('prometheus/eagle_', 6, 5, '.png'), 5, false);
    scale(this.eagle,4);

    this.eagle.animations.play('flying');


    // TEXTS

    // INSTRUCTIONS
    var instructionsString = "RAPIDLY " + INPUT_WORD + " TO WRITHE IN PAIN AND DISLODGE THE EAGLE!";
    var instructionsStyle = { font: 24 + "px commodore_64_pixelizedregular", fill: "#000000", lineHeight: 2, wordWrap: true, wordWrapWidth: this.game.width - 400, align: "center"};
    this.instructionsText = this.game.add.text(this.game.width/2, 20*4, instructionsString, instructionsStyle);
    this.instructionsText.lineSpacing = -8;
    this.instructionsText.anchor.x = 0.5;

    var statStyle = { font: FONT_SIZE_BIG + "px commodore_64_pixelizedregular", fill: "#000000", lineHeight: 2, wordWrap: true, wordWrapWidth: this.game.width - 400, align: "center"};
    this.liverText = this.game.add.text(15*4, 60*4, 'LIVER: 100%', statStyle);
    this.daysText = this.game.add.text(125*4, 60*4, 'DAYS: 0', statStyle);


  },

  update: function () {


  },

  quitGame: function (pointer) {

    this.state.start('Menu');

  }

};


function scale (sprite,amount) {
  sprite.anchor.x = 0;
  sprite.anchor.y = 0;
  sprite.scale.x *= amount;
  sprite.scale.y *= amount;
}
