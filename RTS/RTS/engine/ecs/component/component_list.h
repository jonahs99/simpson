#pragma once

#include "../capacity.h"

#include <array>

template <class T>
using ComponentList = std::array<T, Capacity::n_entities_max>;

class ComponentListBase {
public :
	virtual ~ComponentListBase() { };
};

template <class T>
class ComponentList : public ComponentListBase {
public :
	T& operator [] (std::size_t index) { return components[index]; };
private :
	std::array<T, Capacity::n_entities_max> components;
};