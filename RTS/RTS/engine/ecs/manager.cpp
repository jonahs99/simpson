#include "manager.h"
#include "system\base_sytsem.h"
#include <iostream>

Manager::EntityHandle Manager::get_new_entity_handle() {
	for (EntityHandle handle = 0; handle < Capacity::n_components_max; handle++) {
		if (entity_signatures[handle].none())
			return handle;
	}
	std::cerr << "Exceeded max entity count, entities overwrittern." << std::endl;
	return Capacity::n_components_max - 1;
}

void Manager::remove_entity(Manager::EntityHandle entity) {
	entity_signatures[entity] = 0;
	for (auto system : systems)
		system.second->remove_entity(entity);
}

void Manager::add_entity(Manager::EntityHandle entity) {
	for (auto system : systems)
		system.second->check_entity(entity);
}