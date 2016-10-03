
// Game class

function Game(canvas) {

	this.world = new World();
	this.player_id = -1;
	this.player_tank = null;
	this.renderer = new Renderer(canvas, this);
	this.socket = null;

	this.mouse = new Vec2(200, 200);

	this.frame = 0;

}

Game.prototype.update = function() {

	if (this.player_tank) {
		this.renderer.camera.translate = (new Vec2(canvas.width / 2, canvas.height / 2)).sub(this.player_tank.pos);

		var mouse_dif = this.mouse.sub(this.player_tank.pos);
		
		this.player_tank.steer();
		this.player_tank.walk();
		this.player_tank.pos.mclampxy(-1000,1000,-1000,1000);

		this.mouse = this.player_tank.pos.add(mouse_dif);

	}

	this.world.update_bullets();

	this.frame++;          

};

Game.prototype.loop = function() {

	this.update();
	this.renderer.render_world();

};

Game.prototype.apply_tank_update = function(update) {

	var tank = this.world.tanks[update.id];

	tank.last_pos = new Vec2(tank.pos.x, tank.pos.y);
	tank.last_dir = tank.dir;

	tank.alive = update.alive;
	tank.pos.x = update.x; tank.pos.y = update.y;
	tank.dir = update.dir;
	tank.steer.x = update.sx; tank.steer.y = update.sy;
	tank.wheel1 = update.w1; tank.wheel2 = update.w2;

}

Game.prototype.shoot = function() {

	var gun_pos = this.player_tank.pos.add(DirVec(this.player_tank.dir, this.player_tank.rad*2));
	var vel = this.player_tank.vel.add(DirVec(this.player_tank.dir, 6));

	this.socket.send_bullet(new Bullet(gun_pos, vel));

}

// Rendering

function Renderer(canvas, game) {

	this.canvas = canvas;
	this.context = canvas.getContext("2d");
	this.game = game;
	this.world = game.world;
	this.camera = { translate: new Vec2(canvas.width / 2, canvas.height / 2), scale: 1 };

	this.last_step = (new Date()).getTime();
	this.time_step = 100;

}

Renderer.prototype.advance_time_step = function() {
	this.last_step = (new Date()).getTime();
}

Renderer.prototype.render_world = function() {

	// Calculate interpolation delta

	var elapsed = (new Date()).getTime() - this.last_step;
	var delta = clamp(elapsed / this.time_step, 0, 1);

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
		var tank = this.world.tanks[i];
		if (tank.alive) {
			this.render_tank(tank, delta);
		}
	}

	//Draw bullets
	for (var i = 0; i < this.world.bullets.length; i++) {
		var bullet = this.world.bullets[i];
		this.render_bullet(bullet);
	}

	//Draw cursor
	this.context.fillStyle = '#28f';
	this.context.fillRect(this.game.mouse.x - 5, this.game.mouse.y - 5, 10, 10);

};

Renderer.prototype.render_tank = function(tank, delta) {

	var lerp_pos = tank == this.game.player_tank ? tank.pos : tank.last_pos.lerp(tank.pos, delta);
	var lerp_dir = tank == this.game.player_tank ? tank.dir : (tank.last_dir * (1-delta) + tank.dir * delta);

	this.context.translate(lerp_pos.x, lerp_pos.y);
	this.context.rotate(lerp_dir);

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

	this.context.rotate(-lerp_dir);
	this.context.translate(-lerp_pos.x, -lerp_pos.y);

};

Renderer.prototype.render_bullet = function(bullet) {

	this.context.fillStyle = '#893DCC';
	this.context.lineWidth = 3;
	this.context.strokeStyle = '#B076CC';

	this.context.beginPath();
	this.context.arc(bullet.pos.x, bullet.pos.y, 5, 0, 2*Math.PI);
	this.context.fill();
	this.context.stroke();

}
