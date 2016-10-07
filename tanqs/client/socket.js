
function Socket(game) {

	this.game = game;
	this.game.socket = this;

	this.socket = io();

	this.socket.on('join', this.on_join.bind(this));
	this.socket.on('update', this.on_update.bind(this));

}

// From server communication

Socket.prototype.on_join = function(data) {

	this.game.world.reset();

	for (var i = 0; i < data.n_tanks; i++) {
		this.game.world.new_tank(false);
	}

	this.game.player_id = data.id;
	this.game.player_tank = this.game.world.tanks[this.game.player_id];

};

Socket.prototype.on_update = function(data) {

	for (var i = 0; i < data.newtanks.length; i++) {
		var id = data.newtanks[i];
		if (id != this.game.player_id) {
			this.game.world.new_tank(false);
		}
	}

	if (data.tanks) {
		for (var i = 0; i < data.tanks.length; i++) {

			var tank_data = data.tanks[i];

			if (tank_data.id < this.game.world.tanks.length) {
				this.game.apply_tank_update(tank_data);
			} else {
				console.log('Sync issue: ghost tanks')
			}

		}
	}

	for (var i = 0; i < data.bullets.length; i++) {
		var bullet_data = data.bullets[i];
		var bullet = new Bullet(new Vec2(bullet_data.x, bullet_data.y));
		bullet.vel = new Vec2(bullet_data.vx, bullet_data.vy);
		this.game.world.add_bullet(bullet);
		console.log(this.game.world.bullets.length);
	}

	this.game.renderer.advance_time_step();

}

// To server communication

Socket.prototype.send_input = function() {

	var mouse_dif = this.game.mouse.sub(this.game.player_tank.pos);
	this.game.player_tank.target = mouse_dif;

	var data = {sx: this.game.player_tank.target.x, sy: this.game.player_tank.target.y};

	this.socket.emit('input', data);

}

Socket.prototype.send_bullet = function(id) {

	var data = {id: id};
	this.socket.emit('bullet', data);

}