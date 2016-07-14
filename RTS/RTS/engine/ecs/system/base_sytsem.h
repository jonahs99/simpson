#pragma once

#include <set>

#include "../manager.h"
#include "../component/component_list.h"

class Manager;

class BaseSystem {

public:

	BaseSystem(Manager * m_manager) : manager{ m_manager } { };

	void check_entity(Manager::EntityHandle entity);

	void remove_entity(Manager::EntityHandle entity);

protected:

	template <class T>
	ComponentList<T> & add_dependency() {
		dependencies.push_back(std::type_index(typeid(T)));
		dependency_signature |= manager->component_signatures[std::type_index(typeid(T))];
		return manager->get_component_list<T>();
	};

	// Each system maintain a list system_entities to operate on
	// This list is updated whenever a new entity is added/removed (check_ and remove_entity)

	std::set<Manager::EntityHandle> system_entities;

private:

	Manager * manager;

	std::vector<std::type_index> dependencies;
	Manager::ComponentSignature dependency_signature;

};