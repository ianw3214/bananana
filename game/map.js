"use strict";

let map = {
    // Textures
    background_texture: null,
    pond_texture: null,
    pond_highlight_texture: null,
    shopkeep_texture: null,
    shopkeep_highlight_texture: null,
    //////////////////////////////////////////////////
    pond_hover: false,
    shopkeep_hover: false,
    //////////////////////////////////////////////////
    init: function()
    {
        map.background_texture = graphics.loadImage("res/background.png");
        map.pond_texture = graphics.loadImage("res/pond.png");
        map.pond_highlight_texture = graphics.loadImage("res/pond_highlight.png")
        map.shopkeep_texture = graphics.loadImage("res/shopkeep.png");
        map.shopkeep_highlight_texture = graphics.loadImage("res/shopkeep_select.png");
    },
    update: function (map_click_handled)
    {
        // Reset state
        map.pond_hover = false;
        map.shopkeep_hover = false;

        // Check if mouse hovers over interactable
        var x = input.mouse.x;
        var y = input.mouse.y;
        if (x > 960 - 400 && x < 960 && y > 720-120 && y < 720)
        {
            map.pond_hover = true;
            ui.setCanSelect();
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
        if (x > 80 && x < 80 + 100 && y > 450 && y < 450 + 150) {
            map.shopkeep_hover = true;
            ui.setCanSelect();
            if (input.mouse.clicked === true && !map_click_handled) {
                // Show the shoppers
                ui.openShop();
                // Make sure we have the inventory info needed for the shop
                var command = {
                    "command": "inventory",
                    "id": session.id,
                    "name": session.name
                }
                socket.send(command);
                return true;
            }
        }
        return map_click_handled;
    },
    draw: function()
    {
        graphics.drawImage(map.background_texture, 0, 0, 960, 720);
        if (map.pond_hover)
        {
            graphics.drawImage(map.pond_highlight_texture, 960 - 400, 720 - 120, 400, 120);
        }
        else
        {
            graphics.drawImage(map.pond_texture, 960 - 400, 720 - 120, 400, 120);
        }
        if (map.shopkeep_hover)
        {
            graphics.drawImage(map.shopkeep_highlight_texture, 80, 450, 100, 150);
        }
        else
        {
            graphics.drawImage(map.shopkeep_texture, 80, 450, 100, 150);
        }
    }
};