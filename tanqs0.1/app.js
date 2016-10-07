var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);

var config = require('./server/config.json');

// Serve the public folder statically
app.use(express.static(path.join(__dirname, 'public')));

var server_port = config.port;
http.listen(server_port, function(){
  console.log('listening on : ' + server_port);
});

// Create the game server

var GameServer = require('./server/server.js');

var server = new GameServer(http);

var ms_frame = 20;
var frames_update = 3;
var frame = 0;

setInterval(function() {
	server.world.update.bind(server.world)();
	if (frame % frames_update == 0) {
		server.update_clients.bind(server)();
	}
	frame++;
}, ms_frame);