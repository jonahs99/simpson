#include "base_sytsem.h"

void BaseSystem::check_entity(Manager::EntityHandle entity) {
	if ((manager->entity_signatures[entity] & dependency_signature) == dependency_signature)
		system_entities.insert(entity);
}

void BaseSystem::remove_entity(Manager::EntityHandle entity) {
	system_entities.erase(entity);
}