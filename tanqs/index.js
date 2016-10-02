var express = require('express');
var path = require('path');

var config = require('./server/config.json');

var app = express();
app.use(express.static(path.join(__dirname, 'client')));

var server_port = config.port;
app.listen(server_port, function(){
  console.log('listening on : ' + server_port);
});