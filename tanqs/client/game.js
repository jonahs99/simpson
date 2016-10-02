
// Game class

function Game(canvas) {

	this.world = new World();
	this.player_tank = null;
	this.renderer = new Renderer(canvas, this);

	this.mouse = new Vec2(200, 200);

	this.frame = 0;

}

Game.prototype.update = function() {

	this.renderer.camera.translate = (new Vec2(canvas.width / 2, canvas.height / 2)).sub(this.player_tank.pos);

	if (this.player_tank) {
		var mouse_dif = this.mouse.sub(this.player_tank.pos);
		this.player_tank.steer_to(mouse_dif);
	}

	for (var i = 0; i < this.world.tanks.length; i++) {
		this.world.tanks[i].walk();
		this.world.tanks[i].pos.mclampxy(-1000, 1000, -1000, 1000);
	}

	if (this.player_tank) {
		this.mouse = this.player_tank.pos.add(mouse_dif);
	}

	if (this.frame % 60 == 0) {
		//this.mouse = new Vec2(Math.random() * 800 - 400, Math.random() * 800 - 400);
	}

	this.frame++;

};

Game.prototype.loop = function() {

	this.update();
	this.renderer.render_world();

};

// Rendering

function Renderer(canvas, game) {

	this.canvas = canvas;
	this.context = canvas.getContext("2d");
	this.game = game;
	this.world = game.world;
	this.camera = { translate: new Vec2(canvas.width / 2, canvas.height / 2), scale: 1 };

}

Renderer.prototype.render_world = function() {

	// Clear the canvas
	this.context.setTransform(1, 0, 0, 1, 0, 0);
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.context.translate(this.camera.translate.x, this.camera.translate.y);

	//Draw grid

	this.context.strokeStyle = '#444';
	this.context.lineWidth = 2;

	this.context.beginPath();
	for (var i = -10; i <= 10; i++) {
		this.context.moveTo(i * 100, -1000);
		this.context.lineTo(i * 100, 1000);
		this.context.moveTo(-1000, i * 100);
		this.context.lineTo(1000, i * 100);
	}
	this.context.stroke();

	//Draw tanks
	for (var i = 0; i < this.world.tanks.length; i++) {
		this.render_tank(this.world.tanks[i]);
	}


	//Draw cursor
	this.context.fillStyle = '#28f';
	this.context.fillRect(this.game.mouse.x - 5, this.game.mouse.y - 5, 10, 10);

};

Renderer.prototype.render_tank = function(tank) {

	this.context.translate(tank.pos.x, tank.pos.y);
	this.context.rotate(tank.dir);

	this.context.fillStyle = '#f28';
	this.context.lineWidth = 4;
	this.context.strokeStyle = '#555';
	this.context.lineJoin = 'round';

	this.context.beginPath();
	this.context.rect(-tank.rad, -tank.rad, 2 * tank.rad, 2 * tank.rad);
	this.context.fill();
	this.context.stroke();

	this.context.beginPath();
	this.context.rect(-tank.rad * 1.25, -tank.rad * 1.25, tank.rad * 2.5, tank.rad * 0.75);
	this.context.rect(-tank.rad * 1.25, tank.rad * 0.5, tank.rad * 2.5, tank.rad * 0.75);
	this.context.rect(0, -tank.rad * 0.2, tank.rad * 2, tank.rad * 0.4);
	this.context.fill();
	this.context.stroke();

	this.context.rotate(-tank.dir);
	this.context.translate(-tank.pos.x, -tank.pos.y);

};
