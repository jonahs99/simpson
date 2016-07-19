#pragma once

#include "base_sytsem.h"

#include "../component/translate_component.h"
#include "../component/sprite_component.h"

class RenderSystem : public BaseSystem {

public:

	RenderSystem(Manager * manager);

	void update();

private:

	ComponentList<TranslateComponent>& translate_components;
	ComponentList<SpriteComponent>& sprite_components;

};