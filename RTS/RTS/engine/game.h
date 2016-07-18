#pragma once

#include "ecs/manager.h"

#include "ecs/system/movement_system.h"

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

	Manager manager;

	MovementSystem movement_system;

	Graphics graphics;

};