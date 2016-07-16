#pragma once

#include "base_sytsem.h"

#include "../component/translate_component.h"
#include "../component/movement_component.h"

class MovementSystem : public BaseSystem {

public:

	MovementSystem(Manager * manager);

	void update();

private:

	ComponentList<TranslateComponent>& translate_components;
	ComponentList<MovementComponent>& movement_components;

};