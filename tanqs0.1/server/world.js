
var shared = require('../public/shared/shared.js');
var Vec2 = shared.Vec2;
var clamp = shared.clamp;

// World class with all the nitty gritty server simulation code

function World() {

	this.tanks = [];
	this.bullets = [];

	// populate the tank array with dead tanks
	for (var i = 0; i < 24; i++) {
		this.tanks.push(new Tank());
	}
	for (var i = 0; i < 72; i++) {
		this.bullets.push(new Bullet());
	}

};

// Returns id if successful, returns -1 if server is full
World.prototype.add_tank = function(name) {

	for (var i = 0; i < 24; i++) {
		if (!this.tanks[i].alive) {
			var tank = new Tank();
			tank.alive = true;
			tank.name = name;
			tank.steer_target.set_xy(5,2);
			this.tanks[i] = tank;
			return i;
		}
	}

	return -1;

};

World.prototype.kill_tank = function(id) {

	var tank = this.tanks[id];
	tank.alive = false;

};

World.prototype.kill_bullet = function(bullet_id) {
	this.bullets[bullet_id].alive = false;
};

World.prototype.shoot = function(tank_id) {

	var tank = this.tanks[tank_id];
	if (tank.bullets > 0) {
		tank.bullets--;
		for (var i = 0; i < 72; i++) {
			if (!this.bullets[i].alive) {
				var bullet = this.bullets[i];
				bullet.alive = true;
				bullet.tank = i;
				bullet.pos.set_rt(tank.rad * 2, tank.dir).m_add(tank.pos); // Bullet starts at end of cannon
				bullet.vel.set(tank.vel).m_add((new Vec2()).set_rt(this.speed, tank.dir))
				return i;
			}
		}
	}
	return -1;

};

World.prototype.update = function() {
	for (var i = 0; i < this.tanks.length; i++) {
		var tank = this.tanks[i];
		if (tank.alive) {
			tank.steer();
			tank.drive();
		}
	}
	for (var i = 0; i < this.bullets.length; i++) {
		var bullet = this.bullets[i];
		if (bullet.alive) {
			bullet.drive();
			if (!bullet.pos.in_BB(-1000,-1000,1000,1000)) {
				this.kill_bullet(i);
				this.tanks[bullet.tank].bullets++;
			}
		}
	}
};

module.exports = World;

// Tank class

function Tank() {

	this.alive = false; // When a tank dies we can reuse its space in memory

	// State

	this.pos = new Vec2();
	this.dir = 0;
	this.vel = new Vec2(); 	//	Stored so that bullet velocities
	this.rot_vel = 0;		//	can be calculated.

	this.steer_target = new Vec2(); // A vector pointing from the tank to the players mouse

	this.left_wheel = 0; // Velocity of each wheel
	this.right_wheel = 0;

	this.bullets = 3; // bullets in chamber ( restock when the bullets die )

	// Configuration

	this.rad = 16; // Half the distance between wheels, determines max spin-speed vs max linear-speed
	this.max_velocity = 7; // Max velocity of each wheel
	this.max_wheel_acceleration = 4; // Higher is more responsive

}

Tank.prototype.steer = function() { // Adjusts wheel velocities based on steer_target

	var dir_vec = (new Vec2()).set_rt(1, this.dir);

	var dot = dir_vec.dot(this.steer_target.unit());
	var clockwise = dir_vec.set_rt(1, this.dir + Math.PI / 2).dot(this.steer_target) > 0;
	var backwards = dot < 0;

	if (backwards) {
		dot = -dot;
	}

	var wheel_dif = (1 - dot) * 2;
	if (dot < 0.95) {
		wheel_dif += 0.1;
	}

	var desired_left_wheel = this.max_velocity;
	var desired_right_wheel = this.max_velocity;

	if (clockwise) {
		desired_right_wheel *= 1 - wheel_dif;
	} else {
		desired_left_wheel *= 1 - wheel_dif;
	}

	if (backwards) {
		desired_left_wheel = -desired_left_wheel;
		desired_right_wheel = -desired_right_wheel;
	}

	var speed_factor = clamp(this.steer_target.mag() / 200, 0, 1);
	desired_left_wheel *= speed_factor;
	desired_right_wheel *= speed_factor;

	// Calculate wheel accelerations to be proportional to difference in desired/actual velocities
	var left_acc = clamp((desired_left_wheel - this.left_wheel) / this.max_velocity, -1, 1) * this.max_wheel_acceleration;
	var right_acc = clamp((desired_right_wheel - this.right_wheel) / this.max_velocity, -1, 1) * this.max_wheel_acceleration;

	this.left_wheel += left_acc;
	this.right_wheel += right_acc;

};

Tank.prototype.drive = function() { // Moves and rotates the tank according to wheel velocities

	this.rot_vel = (this.left_wheel - this.right_wheel) / 2 / this.rad;
	this.vel.set_rt((this.left_wheel + this.right_wheel) / 2, this.dir);

	this.dir += this.rot_vel;
	this.pos.m_add(this.vel).m_clampxy(-1000, 1000, -1000, 1000);

};

function Bullet() {

	this.alive = false;
	this.tank = -1;

	this.pos = new Vec2();
	this.vel = new Vec2();

	this.rad = 5;

}

Bullet.prototype.drive = function() {
	this.pos.m_add(this.vel);
};