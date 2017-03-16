
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


		this.game.load.atlas('atlas', 'assets/atlas/assets.png', 'assets/atlas/assets.json');
		this.game.load.audio('peckSFX', 'assets/sounds/peck.mp3');
		this.game.load.audio('swoopdownSFX', 'assets/sounds/swoopdown.mp3');
	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		// this.preloadBar.cropEnabled = false;
	},

	update: function () {

		if (this.cache.isSoundDecoded('peckSFX') && this.ready == false)
		{
			this.ready = true;
			this.state.start('Prometheus');
		}

	}

};
