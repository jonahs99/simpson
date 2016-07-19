#include "game.h"
#include "ecs/component/translate_component.h"
#include "ecs/component/movement_component.h"
#include "ecs/component/sprite_component.h"

#include <iostream>

Game::Game() :
	manager{ TranslateComponent(), MovementComponent(), SpriteComponent() },
	movement_system{ &manager }
{

	Manager::EntityHandle entity = manager.get_new_entity_handle();
	manager.get_component_list<TranslateComponent>()[entity] = TranslateComponent{ 100, 200 };
	manager.get_component_list<MovementComponent>()[entity] = MovementComponent{ 500, 300, 10 };
	manager.get_component_list<SpriteComponent>()[entity] = SpriteComponent{ 64, 64 };
	manager.set_entity_signature(entity,
		manager.component_signatures[std::type_index(typeid(TranslateComponent))] |
		manager.component_signatures[std::type_index(typeid(MovementComponent))] |
		manager.component_signatures[std::type_index(typeid(SpriteComponent))]
	);
	manager.add_entity(entity);

	std::cout << manager.component_signatures[std::type_index(typeid(TranslateComponent))] << std::endl;
	std::cout << manager.component_signatures[std::type_index(typeid(MovementComponent))] << std::endl;

	graphics.initialize_renderer();
	graphics.render_game();

}

void Game::update() {

	movement_system.update();

}

void Game::main_loop() {

	bool running = true;

	while (running) {

		running = graphics.handle_events();

		update();

	}

}