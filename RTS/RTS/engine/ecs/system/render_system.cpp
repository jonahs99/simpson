#include "render_system.h"

RenderSystem::RenderSystem(Manager * manager) :
	BaseSystem{ manager },
	translate_components{ add_dependency<TranslateComponent>() },
	sprite_components{ add_dependency<SpriteComponent>() }
{ }

void RenderSystem::update() {

	for (auto entity : system_entities) {

	}

}