// The CLIENT's view of the world

function World() {

	this.tanks = [];
	this.bullets = [];

	this.reset();

}

World.prototype.reset = function() {

	for (var i = 0; i < 24; i++) {
		this.tanks.push(new Tank());
	}
	for (var i = 0; i < 72; i++) {
		this.bullets.push(new Bullet());
	}

};

World.prototype.update_tanks = function(msg) {

	for (var i = 0; i < msg.length; i++) {

		var tank_data = msg[i];
		var tank = this.tanks[tank_data.id];

		if (tank_data.alive) {
			tank.alive = true;
			tank.rad = tank_data.rad;
			tank.current.pos.set(tank_data.pos);
			tank.current.dir = tank_data.dir;
			tank.old.pos.set(tank.draw.pos);
			tank.old.dir = tank.draw.dir;
		} else {
			tank.alive = false;
		}

	}

};

World.prototype.add_bullets = function(msg) {

	for (var i = 0; i < msg.length; i++) {

		var bullet_data = msg[i];
		var bullet = this.bullets[bullet_data.id];

		//if (bullet_data.alive) {
			bullet.alive = true;
			bullet.pos.set_xy(bullet_data.x, bullet_data.y);
			bullet.vel.set_xy(bullet_data.vx, bullet_data.vy);
			bullet.rad = bullet_data.rad;
		//} else {
		//	bullet.alive = false;
		//}

	}

};

function TankState() {
	this.pos = new Vec2();
	this.dir = 0;
}

function Tank() {
	this.alive = false;
	this.rad = 20;
	this.current = new TankState();
	this.draw = new TankState();
	this.old = new TankState();
}

Tank.prototype.lerp_state = function(delta) {
	this.draw.pos.set_lerp(this.old.pos, this.current.pos, delta);
	this.draw.dir = lerp(this.old.dir, this.current.dir, delta);
}

function Bullet(pos, vel, rad) {

	this.alive = false;

	this.pos = new Vec2();
	this.vel = new Vec2();
	this.rad = rad || 0;

	if (pos) {
		this.pos.set(pos);
	}
	if (vel) {
		this.vel.set(vel);
	}

}