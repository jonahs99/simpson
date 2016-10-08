#include "game.h"
#include "ecs/component/translate_component.h"
#include "ecs/component/movement_component.h"
#include "ecs/component/sprite_component.h"

#include <iostream>

Game::Game()
{

	manager.create_component_lists<TranslateComponent, SpriteComponent, MovementComponent>();

	render_system = manager.create_system<RenderSystem>();

	graphics.initialize_renderer();
	graphics.render_game();

	define_templates();

}

void Game::update() {

	

}

void Game::main_loop() {

	bool running = true;

	while (running) {

		running = graphics.handle_events();

		update();

	}

}

void Game::define_templates() {

	Manager::EntityHandle template_entity = manager.get_new_template_handle();

	manager.get_component_list<TranslateComponent>()[template_entity] = TranslateComponent{ 100, 200 };
	manager.get_component_list<MovementComponent>()[template_entity] = MovementComponent{ 500, 300, 10 };
	manager.get_component_list<SpriteComponent>()[template_entity] = SpriteComponent{ 64, 64 };
	manager.set_entity_signature(template_entity,
		manager.component_signatures[std::type_index(typeid(TranslateComponent))] |
		manager.component_signatures[std::type_index(typeid(MovementComponent))] |
		manager.component_signatures[std::type_index(typeid(SpriteComponent))]
	);
	manager.add_entity(template_entity);

	std::cout << template_entity << std::endl;

}