"use strict";

let map = {
    // Textures
    background_texture: null,
    //////////////////////////////////////////////////
    init: function()
    {
        map.background_texture = graphics.loadImage("res/background.png");
    },
    update: function ()
    {
        // Do nothing for now...
    },
    draw: function()
    {
        graphics.drawImage(map.background_texture, 0, 0, 640, 480);
    }
};