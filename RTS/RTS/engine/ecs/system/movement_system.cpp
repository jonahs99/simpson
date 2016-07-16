#include "movement_system.h"

#include <cmath>
#include <iostream>

MovementSystem::MovementSystem(Manager * manager) : 
	BaseSystem{ manager },
	translate_components{ add_dependency<TranslateComponent>() },
	movement_components{ add_dependency<MovementComponent>() }
{
	manager->add_system(this);
}

void MovementSystem::update() {

	for (auto entity : system_entities) {

		auto& translate = translate_components[entity];
		auto& movement = movement_components[entity];

		double dx = movement.destination_x - translate.x;
		double dy = movement.destination_y - translate.y;
		double mult = movement.speed / sqrt(pow(dx, 2) + pow(dy, 2));

		if (movement.speed / mult < movement.speed)
			continue;

		std::cout << "x " << translate.x << " y " << translate.y << std::endl;

		translate.x += dx * mult;
		translate.y += dy * mult;

	}

}