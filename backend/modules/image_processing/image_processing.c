#include <SDL2/SDL.h>
#include <stdio.h>
#include <stdlib.h>
#include "stb_image.h"
#include <unistd.h>

#define IMAGE_DIR "backend/public/images/"

int main(int argc, char *argv[])
{

    // check if image exists first
    char *image_file = "weasel.jpeg";
    if (access(image_file, F_OK) != 0)
    {
        printf("Image file %s does not exist.\n", image_file);
        return 1;
    }
    if (access(image_file, R_OK) != 0)
    {
        printf("Cannot read image file %s.\n", image_file);
        return 1;
    }

    // load the image using stb_image
    int width, height, num_channels;
    unsigned char *data = stbi_load(image_file, &width, &height, &num_channels, 0);

    if (!data)
    {
        printf("Error loading image %s\n", image_file);
        return 1;
    }

    // initialize SDL2
    if (SDL_Init(SDL_INIT_VIDEO) != 0)
    {
        printf("SDL_Init Error: %s", SDL_GetError());
        return 1;
    }

    // create a window to display the image
    SDL_Window *win = SDL_CreateWindow("Image Viewer", SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED, width, height, 0);
    if (win == NULL)
    {
        printf("SDL_CreateWindow Error: %s", SDL_GetError());
        return 1;
    }

    // create a renderer to render the image
    SDL_Renderer *ren = SDL_CreateRenderer(win, -1, SDL_RENDERER_ACCELERATED | SDL_RENDERER_PRESENTVSYNC);
    if (ren == NULL)
    {
        printf("SDL_CreateRenderer Error: %s", SDL_GetError());
        return 1;
    }

    // create a texture to store the image data
    SDL_Texture *tex = SDL_CreateTexture(ren, SDL_PIXELFORMAT_RGBA8888, SDL_TEXTUREACCESS_STREAMING, width, height);
    if (tex == NULL)
    {
        printf("SDL_CreateTexture Error: %s", SDL_GetError());
        return 1;
    }

    // update the texture with the image data
    SDL_UpdateTexture(tex, NULL, data, width * num_channels);

    // render the texture on the renderer
    SDL_RenderClear(ren);
    SDL_RenderCopy(ren, tex, NULL, NULL);
    SDL_RenderPresent(ren);

    // wait for 3 seconds before quitting
    SDL_Delay(3000);

    SDL_DestroyTexture(tex);
    SDL_DestroyRenderer(ren);
    SDL_DestroyWindow(win);
    SDL_Quit();

    stbi_image_free(data);

    return 0;
}

// gcc -o image_processing image_processing.c -lSDL2 -lm -I./ -DSTB_IMAGE_IMPLEMENTATION
// ./image_processing weasel.jpeg

// docs: https://github.com/nothings/stb/blob/master/stb_image.h
// https://github.com/libsdl-org/SDL/tree/main/docs
