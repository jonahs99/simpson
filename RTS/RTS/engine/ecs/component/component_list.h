#pragma once

#include "../capacity.h"

#include <array>

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