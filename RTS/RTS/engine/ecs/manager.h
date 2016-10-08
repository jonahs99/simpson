#pragma once

#include <vector>
#include <map>
#include <tuple>
#include <memory>
#include <typeindex>
#include <string>
#include <bitset>
#include <cassert>
#include <type_traits>

#include "capacity.h"

class BaseSystem;

template <class... C>
struct ComponentTypeList { };

template <class... S>
struct SystemTypeList { };

template < ComponentTypeList<class... C>, SystemTypeList<class... S> >
class Manager {

public :

	using EntityHandle = unsigned int;
	using ComponentSignature = std::bitset<Capacity::n_components_max>;

	template <class T>
	using ComponentList = std::array<T, Capacity::n_entities_max>;

	Manager() { };

	~Manager() { };

	// Entity

	EntityHandle get_new_entity_handle();

	EntityHandle get_new_template_handle();

	void remove_entity(EntityHandle entity);

	void add_entity(EntityHandle entity);

	void copy_entity(EntityHandle entity, EntityHandle template_handle);

	void set_entity_signature(EntityHandle entity, ComponentSignature signature) {
		entity_signatures[entity] = signature;
	};

	// Component

	template <class T>
	ComponentList<T> & get_component_list() {
		return std::get<T>(component_lists);
	};

	template <class T, class... Rest>
	void set_components(T, Rest...) {

	}

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
	T* create_system() {
		T* system = new T(this);
		systems[std::type_index(typeid(T))] = system;
		return system;
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

	std::map<std::type_index, BaseSystem*> systems;

	std::tuple<ComponentList<C>... > component_lists;

};