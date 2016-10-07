
function Camera() {

	this.translate = new Vec2();
	this.scale = 1;
	this.rotate = 0;

}

function Renderer(game, canvas) {

	this.game = game;
	this.world = game.world;
	this.canvas = canvas;
	this.context = canvas.getContext('2d');

}

Renderer.prototype.render_world = function() {

	// Calculate delta value for interpolation

	var elapsed = (new Date()).getTime() - this.game.last_update_time;
	var delta = clamp(elapsed / TIME_STEP, 0, 1.2); // Allow dead-reckoning for up to 0.2 time steps if necessary

	// Clear the canvas
	this.context.setTransform(1, 0, 0, 1, 0, 0);
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.context.translate(this.canvas.width / 2, this.canvas.height / 2);

	// Pan with the player
	if (this.game.state == GameState.GAME) {
		this.game.player_tank.lerp_state(delta);
		this.game.camera.translate.set(this.game.player_tank.draw.pos).m_scale(-1);
	}

	this.context.translate(this.game.camera.translate.x, this.game.camera.translate.y);

	//Draw the grid
	this.context.strokeStyle = '#333';
	this.context.lineWidth = 1;

	this.context.beginPath();
	for (var i = -10; i <= 10; i++) {
		this.context.moveTo(i * 100, -1000);
		this.context.lineTo(i * 100, 1000);
		this.context.moveTo(-1000, i * 100);
		this.context.lineTo(1000, i * 100);
	}
	this.context.stroke();

	//Draw the tanks
	for (var i = 0; i < this.world.tanks.length; i++) {
		var tank = this.world.tanks[i];
		if (tank.alive) {
			this.render_tank(tank, delta);
		}
	}

	//Draw the bullets
	for (var i = 0; i < this.world.bullets.length; i++) {
		var bullet = this.world.bullets[i];
		if (bullet.alive) {
			this.render_bullet(bullet);
		}
	}

};

Renderer.prototype.render_tank = function(tank, delta) {

	tank.lerp_state(delta);

	this.context.translate(tank.draw.pos.x, tank.draw.pos.y);
	this.context.rotate(tank.draw.dir);

	this.context.fillStyle = '#f28';
	this.context.lineWidth = 4;
	this.context.strokeStyle = '#444';
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

	this.context.rotate(-tank.draw.dir);
	this.context.translate(-tank.draw.pos.x, -tank.draw.pos.y);

	/*this.context.fillStyle = 'red';
	this.context.fillRect(tank.current.pos.x - 4, tank.current.pos.y - 4, 8, 8);
	this.context.fillStyle = 'blue';
	this.context.fillRect(tank.old.pos.x - 4, tank.old.pos.y - 4, 8, 8);*/

}

Renderer.prototype.render_bullet = function(bullet) {

	this.context.fillStyle = '#893DCC';
	this.context.lineWidth = 3;
	this.context.strokeStyle = '#B076CC';

	this.context.beginPath();
	this.context.arc(bullet.pos.x, bullet.pos.y, 5, 0, 2*Math.PI);
	this.context.fill();
	this.context.stroke();

}