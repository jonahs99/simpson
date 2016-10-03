
// Handles networking with the clients
var world = require('../client/shared/world.js');

exports.Net = function(simulation, io) {

	this.simulation = simulation;
	this.io = io;

	this.newtanks = []; // New player ids since the last client update
	this.newbullets = []; //New bullets since the last client update!!

	console.log("Network made!");

	io.on('connection', function(socket) {

		this.on_connect(socket);

		socket.on('disconnect', this.on_disconnect.bind(this, socket));
		socket.on('input', this.on_input.bind(this, socket));
		socket.on('bullet', this.on_bullet.bind(this, socket));

	}.bind(this));

}

// From client communication

exports.Net.prototype.on_connect = function(socket) {
	var id = this.simulation.world.new_tank();
	this.newtanks.push(id);
	this.simulation.players[socket.id] = id;
	this.join_client(socket, id);
	console.log("A user connected. id=" + id);
}

exports.Net.prototype.on_disconnect = function(socket) {
	this.simulation.world.kill_tank(this.simulation.players[socket.id]);
	console.log("A user disconnected.");
}

exports.Net.prototype.on_input = function(socket, msg) {
	this.simulation.apply_tank_input(this.simulation.players[socket.id], msg);
}

exports.Net.prototype.on_bullet = function(socket, msg) {
	var bullet = new world.Bullet(new world.Vec2(msg.x, msg.y), new world.Vec2(msg.vx, msg.vy));
	this.simulation.world.bullets.push(bullet);

	this.newbullets.push(msg);
}

// To clients

exports.Net.prototype.join_client = function(socket, id) {

	var data = {n_tanks: this.simulation.world.tanks.length, id: id};

	socket.emit('join', data);

}

exports.Net.prototype.update_clients = function() {

	var data = {newtanks: this.newtanks, tanks:[], bullets:this.newbullets};
	this.newtanks = [];
	this.newbullets = [];

	for (var i = 0; i < this.simulation.world.tanks.length; i++) {

		var tank = this.simulation.world.tanks[i];
		//if (tank.alive) {
			var tankdata = {id: i, x: tank.pos.x, y: tank.pos.y, dir: tank.dir, w1: tank.wheel1, w2: tank.wheel2,
			 sx: tank.steer.x, sy: tank.steer.y, alive: tank.alive};
			data.tanks.push(tankdata);
		//}

	}

	this.io.emit('update', data);

}