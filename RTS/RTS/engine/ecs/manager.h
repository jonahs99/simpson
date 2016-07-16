#pragma once

#include <vector>
#include <map>
#include <memory>
#include <typeindex>
#include <string>
#include <bitset>
#include <cassert>
#include <type_traits>

#include "capacity.h"
#include "component\component_list.h"

class BaseSystem;

class Manager {

public :

	using EntityHandle = unsigned int;
	using ComponentSignature = std::bitset<Capacity::n_components_max>;

	template <class... T>
	Manager(T... ) { create_component_lists<T...>(); };

	~Manager() {
		for (auto component_list : component_lists)
			delete component_list.second;
	};

	// Entity

	EntityHandle get_new_entity_handle();

	void remove_entity(EntityHandle entity);

	void add_entity(EntityHandle entity);

	void set_entity_signature(EntityHandle entity, ComponentSignature signature) {
		entity_signatures[entity] = signature;
	};

	// Component
	
	template <class T>
	ComponentList<T> & get_component_list() {
		return *dynamic_cast<ComponentList<T>*>(component_lists[std::type_index(typeid(T))]);
	};

	std::string components() {
		std::string out = "Components: ";
		for (auto component_list : component_lists) {
			out += component_list.first.name();
			out += " ";
		}
		return out;
	}

	// System

	template <class T>
	typename std::enable_if<std::is_base_of<BaseSystem, T>::value, void>::type
	add_system(T* system) {
		systems[std::type_index(typeid(T))] = system;
	}

	template <class T>
	typename std::enable_if<std::is_base_of<BaseSystem, T>::value, T*>::type
	get_system() {
		return systems[std::type_index(typeid(T))];
	}

	// Stores the bit associated with each component type

	std::map<std::type_index, ComponentSignature> component_signatures;

	ComponentList<ComponentSignature> entity_signatures;

private :

	template <class T>
	void create_component_lists() {
		assert(component_lists.size() < Capacity::n_components_max);
		component_signatures[std::type_index(typeid(T))] = ComponentSignature(1) << component_lists.size();
		component_lists[std::type_index(typeid(T))] = new ComponentList<T>;
	};

	template <class T, class T1, class... rest>
	void create_component_lists() {
		create_component_lists<T>(); create_component_lists<T1, rest... >();
	};

	std::map<std::type_index, BaseSystem*> systems;

	std::map<std::type_index, ComponentListBase*> component_lists;

};