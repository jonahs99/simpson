#pragma once

#include "ecs/manager.h"

#include "ecs/system/render_system.h"

#include "graphics\graphics.h"

class Game {

public :

	Game();

	void init_ecs();

	void update();

	void main_loop();

private :

	void init_components();

	void init_systems() { };

	void define_templates();

	Manager manager;
	RenderSystem* render_system;


	Graphics graphics;

};