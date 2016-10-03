/*
**
**	THESE CLASSES REPRESENT WORLD OBJECTS
**	SHARED BETWEEN CLIENT AND SERVER SO THAT ALL GAME LOGIC IS THE SAME
**
*/

// Utility functions

function clamp(val, min, max) {
	return Math.max(min, Math.min(val, max));
}

// World class

function World() {

	this.tanks = [];
	this.bullets = [];

}

World.prototype.update = function() {

	for (var i = 0; i < this.tanks.length; i++) {

		var tank = this.tanks[i];
		if (tank.alive) {
			tank.steer();
			tank.walk();
			tank.pos.mclampxy(-1000,1000,-1000,1000);
		}

	}

}

World.prototype.update_bullets = function() {

	for (var i = 0; i < this.bullets.length; i++) {

		var bullet = this.bullets[i];
		bullet.pos.madd(bullet.vel);

	}

}

World.prototype.new_tank = function() {

	for (var id = 0; id < this.tanks.length; id++) {
		if (!this.tanks[id].alive) {
			this.tanks[id] = new Tank(true);
			return id;
		}
	}

	this.tanks.push(new Tank(true));
	return this.tanks.length - 1;

}

World.prototype.kill_tank = function(id) {

	this.tanks[id].alive = false;

}

// Tank Class

function Tank(alive) {

	this.alive = alive || false;

	this.pos = new Vec2();
	this.dir = 0;
	this.rad = 20;

	// For interpolation
	this.last_pos = new Vec2();
	this.last_dir = 0;

	this.wheelmass = 1;
	this.maxforce = 2;
	this.maxspeed = 7;

	this.target = new Vec2(0,4);
	this.wheel1 = 0;
	this.wheel2 = 0;
	this.vel = new Vec2();
	this.rotvel = 0;

}

Tank.prototype.walk = function() {

	this.pos.madd(this.vel);
	this.dir = this.dir + this.rotvel;

};

Tank.prototype.apply_wheel_force = function(f1, f2) {

	this.wheel1 = clamp(this.wheel1 + f1 / this.wheelmass, -this.maxspeed, this.maxspeed);
	this.wheel2 = clamp(this.wheel2 + f2 / this.wheelmass, -this.maxspeed, this.maxspeed);

	this.rotvel = (this.wheel1 - this.wheel2) / 2 / this.rad;
	this.vel = DirVec(this.dir, (this.wheel1 + this.wheel2) / 2);

};

Tank.prototype.steer = function() {

	var dir_vec = DirVec(this.dir);

	var dot = dir_vec.unit().dot(this.target.unit());
	var sdir = dir_vec.dot(this.target.norm()) > 0 ? false : true; // direction to steer (true = clockwise)

	//console.log(sdir);

	var backwards = dot < 0;

	if (backwards)
		dot = -dot;

	var a = 1 - dot;
	if (dot < 0.99)
		a += 0.2;

	var w1 = sdir ? this.maxspeed : this.maxspeed * (1 - a);
	var w2 = sdir ? this.maxspeed * (1 - a) : this.maxspeed;

	if (backwards) {
		w1 = -w1;
		w2 = -w2;
	}

	var speed = clamp(this.target.mag() / 200, 0, 1);
	w1 *= speed;
	w2 *= speed;

	var f1 = (w1 - this.wheel1) / 2 / this.maxspeed * this.maxforce;
	var f2 = (w2 - this.wheel2) / 2 / this.maxspeed * this.maxforce;

	this.apply_wheel_force(f1, f2);

};

function Bullet(pos, vel) {

	this.pos = pos;
	this.vel = vel;
}

// Vector class and Vector math

function Vec2(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

function DirVec(d, r) {
	return (new Vec2(Math.cos(d), Math.sin(d))).scale(r || 1);
}

Vec2.prototype.madd = function(b) {
	this.x += b.x;
	this.y += b.y;
};
Vec2.prototype.madd2 = function(x,y) {
	this.x += x;
	this.y += y;
};
Vec2.prototype.msub = function(b) {
	this.x -= b.x;
	this.y -= b.y;
};
Vec2.prototype.msub2 = function(x,y) {
	this.x -= x;
	this.y -= y;
};
Vec2.prototype.mscale = function(a) {
	this.x *= a;
	this.y *= a;
};
Vec2.prototype.mclamp = function(a) {
	var mag = this.mag();
	if (mag > a) {
		this.mscale(a / mag);
	}
};
Vec2.prototype.mclampxy = function(xmin, xmax, ymin, ymax) {
	this.x = clamp(this.x, xmin, xmax);
	this.y = clamp(this.y, ymin, ymax);
};
Vec2.prototype.add = function(b) {
	return new Vec2(this.x + b.x, this.y + b.y);
};
Vec2.prototype.add2 = function(x,y) {
	return new Vec2(this.x + x, this.y + y);
};
Vec2.prototype.sub = function(b) {
	return new Vec2(this.x - b.x, this.y - b.y);
};
Vec2.prototype.sub2 = function(x,y) {
	return new Vec2(this.x - x, this.y - y);
};
Vec2.prototype.scale = function(a) {
	return new Vec2(this.x * a, this.y * a);
};
Vec2.prototype.clampxy = function(xmin, xmax, ymin, ymax) {
	return new Vec2(clamp(this.x, xmin, xmax), clamp(this.y, ymin, ymax));
};
Vec2.prototype.unit = function() {
	var mag = this.mag();
	return new Vec2(this.x / mag, this.y / mag);
}
Vec2.prototype.norm = function() {
	return new Vec2(-this.y, this.x);
};
Vec2.prototype.dot = function(b) {
	return this.x * b.x + this.y * b.y;
};
Vec2.prototype.mag2 = function() {
	return Math.pow(this.x, 2) + Math.pow(this.y, 2);
};
Vec2.prototype.mag = function() {
	return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
};
Vec2.prototype.manhattan = function() {
	return Math.abs(this.x) + Math.abs(this.y);
};
Vec2.prototype.lerp = function(b, delta) {
	return this.scale(1 - delta).add(b.scale(delta));
};


// Export classes so that server can see inside this module

(function(exports){

	exports.World = World;
	exports.Tank = Tank;
	exports.Vec2 = Vec2;
	exports.Bullet = Bullet;
	exports.clamp = clamp;

}(typeof exports === 'undefined' ? this.share = {} : exports));
