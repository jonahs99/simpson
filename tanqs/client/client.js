
var canvas = document.getElementById("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.style.backgroundColor = '#222';

var game = new Game(canvas);

game.world.tanks.push(new Tank());
game.player_tank = game.world.tanks[0];

document.onmousemove = function(evt) {
	var rect = canvas.getBoundingClientRect();
    game.mouse = (new Vec2(evt.clientX - rect.left, evt.clientY - rect.top)).sub(game.renderer.camera.translate);
};

window.onresize = function(evt) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

setInterval(game.loop.bind(game), 20);