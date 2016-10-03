
// Simulation includes the world information shared with the client but also server-specific things

var world = require('../client/shared/world.js');

// Simulation class

exports.Simulation = function() {

	this.world = new world.World();

	this.players = {};

};

exports.Simulation.prototype.apply_tank_input = function(id, update) {

	var tank = this.world.tanks[id];

	tank.target.x = update.sx;
	tank.target.y = update.sy;

};