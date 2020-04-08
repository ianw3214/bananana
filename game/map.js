"use strict";

let map = {
    // Textures
    background_texture: null,
    pond_texture: null,
    pond_highlight_texture: null,
    //////////////////////////////////////////////////
    pond_hover: false,
    //////////////////////////////////////////////////
    init: function()
    {
        map.background_texture = graphics.loadImage("res/background.png");
        map.pond_texture = graphics.loadImage("res/pond.png");
        map.pond_highlight_texture = graphics.loadImage("res/pond_highlight.png")
    },
    update: function (map_click_handled)
    {
        // Reset state
        map.pond_hover = false;

        // Check if mouse hovers over interactable
        var x = input.mouse.x;
        var y = input.mouse.y;
        if (x > 100 && x < 400 && y > 100 && y < 300)
        {
            map.pond_hover = true;
            // Mouse click on the interactable
            if (input.mouse.clicked === true && !map_click_handled)
            {
                socket.send({
                    "command": "interact",
                    "id": session.id,
                    "action": "fishing"
                });
                return true;
            }
        }
        return map_click_handled;
    },
    draw: function()
    {
        graphics.drawImage(map.background_texture, 0, 0, 640, 480);
        if (map.pond_hover)
        {
            graphics.drawImage(map.pond_highlight_texture, 100, 100, 300, 200);
        }
        else
        {
            graphics.drawImage(map.pond_texture, 100, 100, 300, 200);
        }
    }
};