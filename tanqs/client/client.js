
var canvas = document.getElementById("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.style.backgroundColor = '#222';

var game = new Game(canvas);

var socket = new Socket(game);

setInterval(socket.send_input.bind(socket), 100);
setInterval(game.loop.bind(game), 20);

// Events

document.onmousemove = function(evt) {
	var rect = canvas.getBoundingClientRect();
    game.mouse = (new Vec2(evt.clientX - rect.left, evt.clientY - rect.top)).sub(game.renderer.camera.translate);
};

document.onclick = function(evt) {
	if (game.player_tank) {
		socket.send_bullet(game.player_id);
	}
}

window.onresize = function(evt) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};