
var canvas = document.getElementById("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.style.backgroundColor = '#222';

var game = new Game(canvas);


document.onmousemove = function(evt) {
	var rect = canvas.getBoundingClientRect();
    game.mouse = (new Vec2(evt.clientX - rect.left, evt.clientY - rect.top)).sub(game.renderer.camera.translate);
};

window.onresize = function(evt) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

var socket = new Socket(game);

setInterval(socket.send_input.bind(socket), 100);
setInterval(game.loop.bind(game), 20);