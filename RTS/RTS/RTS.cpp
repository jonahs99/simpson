// RTS.cpp : Defines the entry point for the console application.
//

#include "stdafx.h"

#include <iostream>
#include <string>

#include "engine\game.h"

int main(int argc, char *argv[])
{

	Game game;

	game.main_loop();

    return 0;
}

