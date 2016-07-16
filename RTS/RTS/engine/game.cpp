#include "game.h"
#include "ecs/component/translate_component.h"
#include "ecs/component/movement_component.h"

Game::Game() :
	manager{ TranslateComponent(), MovementComponent() },
	movement_system{ &manager }
{
	Manager::EntityHandle entity = manager.get_new_entity_handle();
	manager.get_component_list<TranslateComponent>()[entity] = TranslateComponent{ 100, 200 };
	manager.get_component_list<MovementComponent>()[entity] = MovementComponent{ 500, 300, 10 };
	manager.set_entity_signature(entity,
		manager.component_signatures[std::type_index(typeid(TranslateComponent))] |
		manager.component_signatures[std::type_index(typeid(MovementComponent))]
	);
	manager.add_entity(entity);
}

void Game::update() {

	movement_system.update();

}

void Game::main_loop() {

	while (true) { update(); }

}