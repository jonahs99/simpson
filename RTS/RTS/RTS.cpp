// RTS.cpp : Defines the entry point for the console application.
//

#include "stdafx.h"

#include <iostream>
#include <string>

#include "engine\ecs\manager.h"

int main()
{

	Manager mgr;

	mgr.create_component_lists<int, char, double, float>();
	std::cout << mgr.components() << std::endl;

	std::cout << mgr.get_component_list<int>()[4] << std::endl;

	std::cin.get();

    return 0;
}

