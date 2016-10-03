var express = require('express');
var path = require('path');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var config = require('./server/config.json');

var simulation_mod = require('./server/simulation.js');
var net_mod = require('./server/net.js');

app.use(express.static(path.join(__dirname, 'client')));

var server_port = config.port;
http.listen(server_port, function(){
  console.log('listening on : ' + server_port);
});

var simulation = new simulation_mod.Simulation();
var net = new net_mod.Net(simulation, io);

setInterval(simulation.world.update.bind(simulation.world), 20);
setInterval(net.update_clients.bind(net), 100);