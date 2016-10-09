
var GameState = { DISCONNECTED: 1, LOGIN: 2, GAME: 3 };

var TIME_STEP = 60;

function Game() {

	// Game state

	this.state = GameState.DISCONNECTED;
	this.world = new World();

	this.last_update_time = (new Date()).getTime();

	this.player_id = null;
	this.player_tank = null;

	this.mouse = new Vec2();

	// Graphics

	this.canvas = document.getElementById('canvas');
	this.canvas.style.backgroundColor = '#222';

	this.splash = document.getElementById('splash');

	this.camera = new Camera();
	this.renderer = new Renderer(this, canvas);

	this.resize_canvas();

	// Client

	this.client = new Client(this);

};

Game.prototype.change_state = function(state) {

	if (state == GameState.DISCONNECTED) {

	} else if (state == GameState.LOGIN) {

		this.splash.style.visibility = 'visible';

	} else if (state == GameState.GAME) {

		this.splash.style.visibility = 'hidden';

	}

	this.state = state;

};

Game.prototype.set_player = function(id) {

	this.player_id = id;
	this.player_tank = this.world.tanks[id];
	this.player_tank.steer_target = new Vec2(10, 0);

};

Game.prototype.update = function() {

	if (this.state == GameState.GAME) {
		this.player_tank.steer_target = {x:this.mouse.x - this.canvas.width / 2, y:this.mouse.y - this.canvas.height / 2};
	}

	this.world.update_bullets();

};

// Events

Game.prototype.resize_canvas = function() {

	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;

};

Game.prototype.on_mousemove = function(evt) {

	var rect = this.canvas.getBoundingClientRect();
    this.mouse.set_xy(evt.clientX - rect.left, evt.clientY - rect.top);

};

Game.prototype.on_click = function(evt) {

	this.client.send_shoot();

};


// Client stuff

var game = new Game();

setInterval(function() {
	game.update.bind(game)();
	game.renderer.render_world.bind(game.renderer)();
}, 20);

setInterval(function() {
	if (game.state == GameState.GAME) {
		game.client.send_input();
	}
}, TIME_STEP);

// Events

window.onresize = game.resize_canvas.bind(game);
window.onmousemove = game.on_mousemove.bind(game);
window.onclick = game.on_click.bind(game);

var nick_form = document.getElementById('nick_form');
var nick_text = document.getElementById('nick');
nick_form.onsubmit = function() {
	game.client.send_login(nick_text.value);
	return false;
};