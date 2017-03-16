
BasicGame.Prometheus = function (game) {

};

BasicGame.Prometheus.prototype = {

    create: function () {

      this.stage.smoothed = false;

      this.stage.backgroundColor = 0xcccccc;

      this.bg = this.add.sprite(0,0,'atlas');
      this.bg.animations.add('day',Phaser.Animation.generateFrameNames('prometheus/bg_', 1, 1, '.png'), 5, true);
      this.bg.animations.add('night',Phaser.Animation.generateFrameNames('prometheus/bg_', 2, 2, '.png'), 5, true);
      scale(this.bg,400);

      this.bg.animations.play('day');

      this.prometheus = this.add.sprite(360,220,'atlas');
      this.prometheus.animations.add('idle',Phaser.Animation.generateFrameNames('prometheus/prometheus_', 1, 1, '.png'), 5, true);
      this.prometheus.animations.add('struggle',Phaser.Animation.generateFrameNames('prometheus/prometheus_', 1, 2, '.png'), 5, true);
      this.prometheus.animations.add('nighttime',Phaser.Animation.generateFrameNames('prometheus/prometheus_', 3, 3, '.png'), 5, true);
      scale(this.prometheus,4);

      this.prometheus.animations.play('idle');

      this.rock = this.add.sprite(0,0,'atlas');
      this.rock.animations.add('day',Phaser.Animation.generateFrameNames('prometheus/rock_', 1, 1, '.png'), 5, true);
      this.rock.animations.add('night',Phaser.Animation.generateFrameNames('prometheus/rock_', 2, 2, '.png'), 5, true);
      scale(this.rock,4);

      this.rock.animations.play('day');

      this.eagle = this.add.sprite(100,100,'atlas');
      this.eagle.animations.add('flying',Phaser.Animation.generateFrameNames('prometheus/eagle_', 1, 4, '.png'), 5, true);
      this.eagle.animations.add('perched',Phaser.Animation.generateFrameNames('prometheus/eagle_', 5, 5, '.png'), 5, true);
      this.eagle.animations.add('peck',Phaser.Animation.generateFrameNames('prometheus/eagle_', 6, 5, '.png'), 5, false);
      scale(this.eagle,4);

      this.eagle.animations.play('flying');


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
