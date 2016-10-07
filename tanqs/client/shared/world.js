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

World.prototype.reset = function() {

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

		if (bullet.alive) {
			bullet.pos.madd(bullet.vel);

			if (!bullet.pos.in_BB(-1000,1000,-1000,1000)) {
				if (bullet.richochet <= 0) {
					bullet.alive = false;
				} else {
					if (bullet.pos.x < -1000 || bullet.pos.x > 1000) {
						bullet.vel.x = -bullet.vel.x;
					}
					if (bullet.pos.y < -1000 || bullet.pos.y > 1000) {
						bullet.vel.y = -bullet.vel.y;
					}
					bullet.richochet--;
				}
			}
		}

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

World.prototype.add_bullet = function(bullet) {

	for (var i = 0;; i++) {
		if (this.bullets[i]) {
			if (!this.bullets[i].alive) {
				this.bullets[i] = bullet;
				return;
			}
		} else {
			this.bullets.push(bullet);
			return;
		}
	}

}

World.prototype.shoot = function(id) {

	var tank = this.tanks[id];

	if (tank) {
		var gun_pos = tank.pos.add(DirVec(tank.dir, tank.rad * 2));
		var bullet = new Bullet(gun_pos);
		bullet.vel = tank.vel.add(DirVec(tank.dir, bullet.speed));

		this.add_bullet(bullet);
	}

	return bullet;

}

// Tank Class

function Tank(alive) {

	this.alive = alive || false;

	this.pos = new Vec2();
	this.dir = 0;
	this.rad = 16;

	// For interpolation
	this.last_pos = new Vec2();
	this.last_dir = 0;

	this.wheelmass = 1;
	this.maxforce = 4;
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

	/*	Some math going on here...

		tank.target is the vector pointing in the direction of his players mouse
		tanks are controlled with 2 tread (wheel) velocities
		tank.steer() calculates desired wheel velocities based on target, then calculates torques to apply to each wheel

	*/

	var dir_vec = DirVec(this.dir);

	var dot = dir_vec.unit().dot(this.target.unit());
	var sdir = dir_vec.dot(this.target.norm()) < 0; // direction to steer (true = clockwise)

	var backwards = dot < 0; // go backwards if mouse vector points behind tank

	if (backwards)
		dot = -dot;

	var a = clamp((1 - dot) * 2, 0, 2); // a is the desired difference in wheel velocity (0 if straight ahead, 2 if 90 deg for wheels in opposite directions)
	//if (dot < 0.99)
	//	a += 0.2;

	var w1 = sdir ? this.maxspeed : this.maxspeed * (1 - a);
	var w2 = sdir ? this.maxspeed * (1 - a) : this.maxspeed;

	if (backwards) {
		w1 = -w1;
		w2 = -w2;
	}

	var speed = clamp(this.target.mag() / 200, 0, 1); // scale the speed down if the mouse is close to the tank
	w1 *= speed;
	w2 *= speed;

	var f1 = (w1 - this.wheel1) / 2 / this.maxspeed * this.maxforce; // apply a force to the wheels proportional
	var f2 = (w2 - this.wheel2) / 2 / this.maxspeed * this.maxforce; // to the difference in desired/actual velocities

	this.apply_wheel_force(f1, f2);

};

// Bullet class

function Bullet(pos) {

	this.alive = true; // bullets die when hit something/ out of bounds, then we can reclaim the memory for new bullets
	this.richochet = 5; // times left bullet will richochet

	this.pos = pos;

	this.speed = 9;
	this.vel = new Vec2();

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
Vec2.prototype.in_BB = function(x1, x2, y1, y2) {
	return (this.x >= x1) && (this.x <= x2) && (this.y >= y1) && (this.y <= y2);
};


// Export classes so that server can see inside this module

(function(exports){

	exports.World = World;
	exports.Tank = Tank;
	exports.Vec2 = Vec2;
	exports.Bullet = Bullet;
	exports.clamp = clamp;

}(typeof exports === 'undefined' ? this.share = {} : exports));
