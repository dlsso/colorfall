Game.Play = function (game) { };

var platformVelocity;
var num_platforms = 150;
var variance = 8;
var increase = 1.008;
var bgRed;
var bgGreen;
var bgBlue;
var updateCounter = 0
var platformName = ''

Game.Play.prototype = {
    create: function () {
	game.physics.startSystem(Phaser.Physics.ARCADE);

	cursors = game.input.keyboard.createCursorKeys();

	sides = game.add.group();
	sides.enableBody = true;
	left = sides.create(-20, -20, 'platform');
	left.scale.setTo(20, 2 * h);
	left.body.immovable = true;
	right = sides.create(w + 1, -20, 'platform');
	right.scale.setTo(20, 2 * h);
	right.body.immovable = true;

	killZones = game.add.group();
	killZones.enableBody = true;
	topKill = killZones.create(0, -43, 'platform');
	topKill.scale.setTo(w, 1);
	topKill.body.immovable = true;
	bottomKill = killZones.create(0, h-2, 'platform');
	bottomKill.scale.setTo(w, 1);
	bottomKill.body.immovable = true;
	


	platforms = game.add.group();
	platforms.enableBody = true;

	var y = 1;
	this.createPlatform(marker, y, 4, '');
	for (var i = 0; i < num_platforms - 1; i++) {
	    y = y - (Math.floor(Math.random() * 4) + 4);
	    this.generatePlatform(y);
	}

	player = game.add.sprite(playerStart, h - 20, 'player');
	player.anchor.setTo(0.5, 1);
	game.physics.arcade.enable(player);
	player.body.gravity.y = 2000;
	player.inAir = true;
	player.frame = 1;

	platformVelocity = -100;

	score = 0;	
 	scoreText = game.add.text(w - 10, 10, 'score: ' + score, { font: '20px Arial', fill: '#333' });
	scoreText.anchor.setTo(1, 0);
	bestText = game.add.text(w - 10, 30, 'best: ' + bestScore, { font: '20px Arial', fill: '#333' });
	bestText.anchor.setTo(1, 0);

	bgRed = 170;
	bgGreen = 204;
	bgBlue = 255;

	cursors.up.onDown.add(Game.Menu.prototype.toggleAudio, this);
    },

    update: function () {
	game.physics.arcade.collide(player, sides);
	game.physics.arcade.collide(player, topKill, this.endGame, null, this);
	game.physics.arcade.collide(player, bottomKill, this.hitPlatform, null, this);
	game.physics.arcade.overlap(topKill, platforms, this.deletePlatform, null, this);
	game.physics.arcade.collide(player, platforms, this.hitPlatform, null, this);

	player.frame = 1;
	player.body.velocity.x = 0;

	if (game.device.desktop) {
	    Game.Menu.prototype.desktopControls();
	}
	else {
	    Game.Menu.prototype.mobileControls();
	}

	if (player.body.velocity.y != platformVelocity) {
	    player.inAir = true;
	}

	if(cursors.down.isDown && updateCounter > 60){
		if(player.key === 'player') {
			player.loadTexture('player2', 1)
			updateCounter = 0
		}
		else if(player.key === 'player2') {
			if(player.inAir === false && platformName === 'platform2') {
				player.y = player.y + 5 - platformVelocity/10
			}	
			player.loadTexture('player3', 1)
			updateCounter = 0
		}
		else if(player.key === 'player3') {
			if(player.inAir === false && platformName === 'platform3') {
				player.y = player.y + 5 - platformVelocity/10
			}
			player.loadTexture('player4', 1)
			updateCounter = 0
		}
		else if(player.key === 'player4') {
			if(player.inAir === false && platformName === 'platform4') {
				player.y = player.y + 5 - platformVelocity/10
			}
			player.loadTexture('player2', 1)
			updateCounter = 0
		}
	}
	updateCounter++

	platforms.setAll('body.velocity.y', platformVelocity);
	scoreText.text = 'score: ' + score;
	bestText.text = 'best: ' + bestScore;
    },

    createPlatform: function (x, y, width, suffix) {
	platform = platforms.create(x * 20, h - y * 20, 'platform' + suffix);
	platform.scale.setTo(width * 20, 1);
	platform.body.immovable = true;
	platform.untouched = true;
    },

    generatePlatform: function (y) {
	suffix = '';
	rand = Math.floor(Math.random() * 1000);
	if (rand > 100 && rand <=400) {
	    suffix = '2';
	}
	else if (rand > 400 && rand <=700) {
	    suffix = '3';
	}
	else if (rand > 700) {
	    suffix = '4';
	}

	var x = -1;
	// while (x < 0 || x > (w / 20 - 4)) {
	//     x = variance - Math.floor(Math.random() * (2 * variance + 1)) + marker;
	// }
	// Changed random x function
	while (x < 0 || x > (w / 20 - 4)) {
		x = Math.floor(Math.random()*w)
	}

	this.createPlatform(x, y, 20, suffix);
	this.createPlatform(x+25, y, 20, suffix);
	this.createPlatform(x-25, y, 20, suffix);
	marker = x;
    },

    deletePlatform: function (topKill, platform) {
	platform.destroy();
    },

    hitPlatform: function (player, platform) {
	if (platform.untouched) {
	    score++;
	    platform.untouched = false;

	    if (score > bestScore) {
		bestScore = score;
	    }

	    platformVelocity *= increase;
	    
	    this.updateBackground();
	}

	if (player.inAir && player.body.touching.down && score > 1) {
	    player.inAir = false;
	    game.add.tween(player.scale).to({x: 1, y: 0.8}, 50, null, true, 0, false, false).to({x: 1, y: 1}, 200, null, true, 0, false, false);
	}
	platformName = platform.key
    },
    
    updateBackground: function () {
	if (score < 11) {
	    // #aaccff 4ever
	}
	else if (score < 36) {
	    bgBlue -= 2;
	    bgGreen += 2;
	}
	else if (score < 61) {
	    bgBlue += 1;
	    bgRed += 3;
	    bgGreen -= 2;
	}
	else if (score < 86) {
	    bgRed -= 3;
	    bgGreen += 2;
	}
	else if (score < 111) {
	    bgBlue += 1;
	    bgGreen -= 2;
	}
	else if (score < 136) {
	    bgBlue -= 2;
	    bgRed += 2;
	    bgGreen += 1;
	}

	console.log("bgRed, bgGreen, bgBlue:", bgRed, bgGreen, bgBlue)

	color = '#' + bgRed.toString(16) + bgGreen.toString(16) + bgBlue.toString(16);
	game.stage.backgroundColor = color;
    },

    endGame: function () {
	playerStart = player.x;
	game.state.start('Menu');
    }
};
