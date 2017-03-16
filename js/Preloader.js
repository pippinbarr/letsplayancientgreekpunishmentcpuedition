
BasicGame.Preloader = function (game) {

	// this.background = null;
	// this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar
		// this.background = this.add.sprite(0, 0, 'preloaderBackground');
		// this.preloadBar = this.add.sprite(300, 400, 'preloaderBar');

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		// this.load.setPreloadSprite(this.preloadBar);

		// this.load.spritesheet('prometheus', 'assets/sprites/prometheus/prometheus.png', 21, 10);
		// this.load.spritesheet('eagle', 'assets/sprites/prometheus/eagle.png', 12, 11);
		// this.load.spritesheet('rock', 'assets/sprites/prometheus/rockandchains.png',200,100);
		// this.load.spritesheet('bg', 'assets/sprites/prometheus/bg.png',2,1);

		// this.game.load.json('sprites', 'assets/atlas/atlas.json');
		// this.load.atlasJSONHash('atlas','assets/atlas/atlas.png',"assets/atlas.json",null);

this.game.load.atlas('atlas', 'assets/atlas/assets.png', 'assets/atlas/assets.json');
	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		// this.preloadBar.cropEnabled = false;
	},

	update: function () {

		// if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
		if (this.ready == false)
		{
			this.ready = true;
			this.state.start('Prometheus');
		}

	}

};
