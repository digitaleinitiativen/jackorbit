class GameScene extends Phaser.Scene {
	constructor() {
		super('game');

		this.jack = null;
		this.asteroids = null;
		this.falling = null;

		this.scoreText = null;
		this.levelText = null;

		this.cursors = null;
		this.energy = 3;

		this.reduceEnergyEvent = null;
		this.spawnAsteroidEvent = null;

		this.level = 1;
		this.score = 0;

	}

	preload() {
		this.load.image('just-blue', 'gfx/just-blue.png');
		this.load.image('falling', 'gfx/falling.png');
		this.load.image('asteroid', 'gfx/asteroid.png');
		this.load.spritesheet('jackorbit', 'gfx/jackorbit.png', {
			frameWidth: 50,
			frameHeight: 140
		});
	}

	create() {
		this.add.image(256, 256, 'just-blue', 0);

		this.scoreText = this.add.text(4, 4, "SCORE: " + this.score);
		this.levelText = this.add.text(4, 16, "LEVEL: " + this.level);

		this.asteroids = this.add.group();
		this.falling = this.add.group();

		this.jack = this.add.sprite(250, 412, 'jackorbit', 0);
		this.jack.setOrigin(0.5, 1);

		this.physics.add.existing(this.jack);
		this.jack.body.collideWorldBounds = true;
		this.jack.setFrame(this.energy);
		this.jack.setY(512 - this.energy * 10);


		this.cursors = this.input.keyboard.createCursorKeys();

		this.time.addEvent({
			loop: true,
			callback: this.spawnFalling,
			callbackScope: this,
			delay: 50
		});

		this.spawnAsteroidEvent = this.time.addEvent({
			loop: true,
			callback: this.spawnAsteroid,
			callbackScope: this,
			delay: 1000
		});

		this.reduceEnergyEvent = this.time.addEvent({
			loop: true,
			callback: this.reduceEngery,
			callbackScope: this,
			delay: 2200
		});


		this.time.addEvent({
			loop: true,
			callback: this.levelUp,
			callbackScope: this,
			delay: 10000
		});

	}

	update() {
		if(this.cursors.left.isDown) {
			this.jack.body.setVelocityX(-400);
			this.jack.setFlipX(true);
		}
		else if(this.cursors.right.isDown) {
			this.jack.body.setVelocityX(400);
			this.jack.setFlipX(false);
		}
		else
			this.jack.body.setVelocityX(0);

		this.physics.overlap(this.jack, this.asteroids, this.getEngery, function(){ return true; }, this);
	}

	getEngery(jack, asteroid) {
		asteroid.destroy();
		this.energy = Math.min(this.energy + 1, 9);
		this.jack.setFrame(this.energy);
		this.jack.setY(512 - this.energy * 20);
		this.score += 100 + 17 * this.level;
		this.scoreText.setText("SCORE: " + this.score);
	}

	reduceEngery() {
		if(this.energy == 0) this.stop();
		this.energy = Math.max(this.energy - 1, 0);
		this.jack.setFrame(this.energy);
		this.jack.setY(512 - this.energy * 20);
	}

	spawnAsteroid() {
		var x = Math.random() * (512 - 32) + 16;

		let asteroid = this.add.sprite(x, -16, 'asteroid');
		asteroid.setAngle(90 * Math.floor(Math.random() * 3));
		this.asteroids.add(asteroid);

		this.physics.add.existing(asteroid);
		asteroid.body.setVelocityY(500);
	}

	spawnFalling() {
		var x = Math.random() * (512 - 32) + 16;

		let falling = this.add.sprite(x, -16, 'falling');
		this.falling.add(falling);

		this.physics.add.existing(falling);
		falling.body.setVelocityY(800 + Math.random() * 60);
	}

	levelUp() {
		this.level++;

		this.spawnAsteroidEvent.timeScale += 0.1;
		this.reduceEnergyEvent.timeScale += 0.12;

		this.levelText.setText("LEVEL: " + this.level);

	}

	stop() {
		alert("game over");
	}

}


let game = new Phaser.Game({
	parent: 'phaser',
	width: 512,
	height: 512,
	physics: {
		default: 'arcade',
	},
	scene: [GameScene]
});

export default game;