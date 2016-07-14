#pragma once

#include <vector>
#include <map>
#include <memory>
#include <typeindex>
#include <string>
#include <bitset>
#include <cassert>

#include "capacity.h"
#include "component\component_list.h"

class BaseSystem;

class Manager {

public :

	using EntityHandle = unsigned int;
	using ComponentSignature = std::bitset<Capacity::n_components_max>;

	Manager() { };

	~Manager() {
		for (auto component_list : component_lists)
			delete component_list.second;
	};

	template <class T>
	void create_component_lists() {
		assert(component_lists.size() < Capacity::n_components_max);
		component_signatures[std::type_index(typeid(T))] = ComponentSignature(1) << component_lists.size();
		component_lists[std::type_index(typeid(T))] = new ComponentList<T>;
	};

	template <class T, class T1, class... rest>
	void create_component_lists() {
		create_component_lists<T>(); create_component_lists<T1, rest... >(); };
	
	template <class T>
	ComponentList<T> & get_component_list() {
		return *dynamic_cast<ComponentList<T>*>(component_lists[std::type_index(typeid(T))]);
	};

	EntityHandle get_new_entity_handle();

	void remove_entity(EntityHandle entity);

	std::string components() {
		std::string out = "Components: ";
		for (auto component_list : component_lists) {
			out += component_list.first.name();
			out += " ";
		}
		return out;
	}

	// Stores the bit associated with each component type

	std::map<std::type_index, ComponentSignature> component_signatures;

	ComponentList<ComponentSignature> entity_signatures;

private :

	std::vector<BaseSystem*> systems;

	std::map<std::type_index, ComponentListBase*> component_lists;

};