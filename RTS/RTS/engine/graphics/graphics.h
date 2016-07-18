#pragma once

#include "SDL.h"
#include "glew.h"

class Graphics {

public :

	bool initialize_renderer() {

		window = SDL_CreateWindow("Buildings and Units",
			SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED, 1024, 720, SDL_WINDOW_OPENGL);

		context = SDL_GL_CreateContext(window);

		set_opengl_attributes();

		SDL_GL_SetSwapInterval(1);

		return true;

	}

	void render_game() {

		glClearColor(0.0, 0.5, 1.0, 1.0);
		glClear(GL_COLOR_BUFFER_BIT);
		SDL_GL_SwapWindow(window);

	}

	bool handle_events() {

		SDL_Event eve;

		while (SDL_PollEvent(&eve)) {
			if (eve.type == SDL_QUIT)
				return false;
		}

		return true;

	}

private :

	void set_opengl_attributes()
	{
		SDL_GL_SetAttribute(SDL_GL_CONTEXT_PROFILE_MASK, SDL_GL_CONTEXT_PROFILE_CORE);

		SDL_GL_SetAttribute(SDL_GL_CONTEXT_MAJOR_VERSION, 3);
		SDL_GL_SetAttribute(SDL_GL_CONTEXT_MINOR_VERSION, 2);

		SDL_GL_SetAttribute(SDL_GL_DOUBLEBUFFER, 1);
	}

	SDL_Window * window;

	SDL_GLContext context;

};