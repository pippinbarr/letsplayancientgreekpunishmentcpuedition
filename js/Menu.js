
BasicGame.Menu = function (game) {

};

BasicGame.Menu.prototype = {

	menuItemNames: ["Sisyphus","Tantalus","Prometheus","Danaids","Zeno"],
	menuItems: [],
	selected: 0,
	menuItemStyle: undefined,
	menuSelectedStyle: undefined,

	create: function () {

		this.stage.backgroundColor = '#AADDDD';

		var titleString = "LET'S PLAY:\nANCIENT GREEK PUNISHMENT:\nCPU EDITION!";
    var titleStyle = { font: 42 + "px commodore_64_pixelizedregular", fill: "#000000", lineHeight: 2, wordWrap: true, wordWrapWidth: this.game.width, align: "center"};
    this.titleText = this.game.add.text(this.game.width/2, 4*4, titleString, titleStyle);
    this.titleText.lineSpacing = -8;
    this.titleText.anchor.x = 0.5;

		var menuSpacing = 8*4;
		this.menuItemStyle = { font: 32 + "px commodore_64_pixelizedregular", fill: "#000000", lineHeight: 2, wordWrap: true, wordWrapWidth: this.game.width, align: "center"};
		this.menuSelectedStyle = { font: 32 + "px commodore_64_pixelizedregular", fill: "#DD5555", lineHeight: 2, wordWrap: true, wordWrapWidth: this.game.width, align: "center"};

		for (var i = 0; i < this.menuItemNames.length; i++) {
			if (i == 0) {
				y = 52*4;
			}
			else {
				y = this.menuItems[i-1].y + menuSpacing;
			}
			var text = this.game.add.text(this.game.width/2, y, this.menuItemNames[i].toUpperCase(), this.menuItemStyle);
			text.anchor.x = 0.5;
			this.menuItems.push(text);
		}

		this.menuItems[0].setStyle(this.menuSelectedStyle);

		this.time.events.add(500 + Math.random() * 2000,this.makeChoice,this);

	},

	makeChoice: function () {
		var r = Math.random();
		if (r < 0.4) {
			this.menuUp();
			this.time.events.add(500 + Math.random() * 2000,this.makeChoice,this);
		}
		else if (r < 0.8) {
			this.menuDown();
			this.time.events.add(500 + Math.random() * 2000,this.makeChoice,this);
		}
		else {
			this.menuSelect();
		}
	},

	update: function () {

	},

	menuUp: function () {
		this.menuItems[this.selected].setStyle(this.menuItemStyle);
		this.selected--;
		if (this.selected < 0) this.selected = this.menuItems.length - 1;
		this.menuItems[this.selected].setStyle(this.menuSelectedStyle);
	},

	menuDown: function () {
		this.menuItems[this.selected].setStyle(this.menuItemStyle);
		this.selected++;
		if (this.selected == this.menuItems.length) this.selected = 0;
		this.menuItems[this.selected].setStyle(this.menuSelectedStyle);
	},

	menuSelect: function () {
		this.state.start(this.menuItemNames[this.selected]);
	},


};
