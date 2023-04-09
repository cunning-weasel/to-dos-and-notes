// need to save to fs and create pointer to db
#include <SDL2/SDL.h>
#include <stdio.h>
#include <stdlib.h>
#include "stb_image.h"

int main(int argc, char *argv[])
{
    if (argc < 2)
    {
        printf("Usage: %s <image_file>\n", argv[0]);
        return 1;
    }

    const char *image_file = argv[1];
    int width, height, num_channels;
    unsigned char *data = stbi_load(image_file, &width, &height, &num_channels, 0);

    if (!data)
    {
        printf("Error loading image %s\n", image_file);
        return 1;
    }

    if (SDL_Init(SDL_INIT_VIDEO) != 0)
    {
        printf("SDL_Init Error: %s", SDL_GetError());
        return 1;
    }

    SDL_Window *win = SDL_CreateWindow("Image Viewer",
                                       SDL_WINDOWPOS_UNDEFINED,
                                       SDL_WINDOWPOS_UNDEFINED,
                                       width, height, 0);
    if (win == NULL)
    {
        printf("SDL_CreateWindow Error: %s", SDL_GetError());
        return 1;
    }

    SDL_Renderer *ren = SDL_CreateRenderer(win, -1, SDL_RENDERER_ACCELERATED | SDL_RENDERER_PRESENTVSYNC);
    if (ren == NULL)
    {
        printf("SDL_CreateRenderer Error: %s", SDL_GetError());
        return 1;
    }

    SDL_Texture *tex = SDL_CreateTexture(ren, SDL_PIXELFORMAT_RGBA8888,
                                         SDL_TEXTUREACCESS_STREAMING,
                                         width, height);
    if (tex == NULL)
    {
        printf("SDL_CreateTexture Error: %s", SDL_GetError());
        return 1;
    }

    SDL_UpdateTexture(tex, NULL, data, width * num_channels);

    SDL_RenderClear(ren);
    SDL_RenderCopy(ren, tex, NULL, NULL);
    SDL_RenderPresent(ren);

    SDL_Delay(3000);

    SDL_DestroyTexture(tex);
    SDL_DestroyRenderer(ren);
    SDL_DestroyWindow(win);
    SDL_Quit();

    stbi_image_free(data);

    return 0;
}

// gcc -o image_viewer image_viewer.c -lSDL2 -lm -lstb_image

// docs: https://github.com/nothings/stb/blob/master/stb_image.h
