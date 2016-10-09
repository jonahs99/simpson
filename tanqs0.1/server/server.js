
var World = require('./world.js');

var GameServer = function(http) {

	this.io = require('socket.io')(http);

	this.world = new World();
	this.clients = {};

	this.frame_input = {shots:[]};

	this.io.on('connection', this.setup_socket_events.bind(this));

};

GameServer.prototype.update_world = function(socket) {

	this.world.update();

};

GameServer.prototype.setup_socket_events = function(socket) {

	this.on_connection(socket);
	socket.on('disconnect', this.on_disconnect.bind(this, socket));
	socket.on('login', this.on_login.bind(this, socket));
	socket.on('input', this.on_input.bind(this, socket));
	socket.on('shoot', this.on_shoot.bind(this, socket));

};

// Sends

GameServer.prototype.send_join = function(socket, player_id, name) {

	var msg = {id: player_id, name: name};

	socket.emit('join', msg);
	this.update_clients();

};

GameServer.prototype.update_clients = function() {

	var msg = {tanks: [], shots: []};

	for (var i = 0; i < this.frame_input.shots.length; i++) {
		var bullet_id = this.world.shoot(this.frame_input.shots[i]);
		if (bullet_id > -1) {
			var bullet = this.world.bullets[bullet_id];
			msg.shots.push({id: bullet_id, tank: bullet.tank, x: bullet.pos.x, y: bullet.pos.y, vx: bullet.vel.x, vy: bullet.vel.y});
		}
	}
	this.frame_input.shots = [];

	for (var i = 0; i < 24; i++) {
		var tank = this.world.tanks[i];
		var tank_data = {id: i, alive: tank.alive, rad: tank.rad, bullets:0};
		if (tank.alive) {
			tank_data.bullets = tank.bullets;
			tank_data.pos = {x: tank.pos.x, y: tank.pos.y};
			tank_data.dir = tank.dir;
		}
		msg.tanks.push(tank_data);
	}



	this.io.emit('update', msg);

};

// Events

GameServer.prototype.on_connection = function(socket) {

	console.log("A user connected.");
	this.clients[socket.id] = { tank_id: -1 };

};

GameServer.prototype.on_disconnect = function(socket) {

	console.log("A user disconnected.");
	var tank_id = this.clients[socket.id].tank_id;
	if (tank_id > -1) {
		this.world.kill_tank(tank_id);
	}

};

GameServer.prototype.on_login = function(socket, msg) {

	var player_id = this.world.add_tank(msg.name);

	if (player_id > -1) {
		console.log("A user logged in with nickname " + msg.name + ", tank id " + player_id + ".");
		this.clients[socket.id].tank_id = player_id;
		this.send_join(socket, player_id, msg.name);
	} else {
		console.log("A user attempted to log in with nickname " + msg.name + ", but the server is full.");
		// TODO: alert client that login was unsuccessful
	}

};

GameServer.prototype.on_input = function(socket, msg) {

	var tank_id = this.clients[socket.id].tank_id;
	if (tank_id > -1) {
		var client_tank = this.world.tanks[tank_id];
		client_tank.steer_target.set_xy(msg.x, msg.y);
	}

};

GameServer.prototype.on_shoot = function(socket, msg) {

	var tank_id = this.clients[socket.id].tank_id;
	if (tank_id > -1) {
		this.frame_input.shots.push(tank_id);
	}

};

module.exports = GameServer;