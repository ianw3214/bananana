"use strict";

// Only worry about hair for now

let wardrobe = {
    // Textures
    background: null,
    // Wardrobe state
    hair_state: null,
    // Hardcoded data
    icons: [],
    init: function()
    {
        wardrobe.icons = [
            {
                normal: "res/icons/wardrobe/nohair.png",
                hover: "res/icons/wardrobe/nohair_hover.png",
                id: -1
            },
            {
                normal: "res/icons/wardrobe/basichair.png",
                hover: "res/icons/wardrobe/basichair_hover.png",
                invalid: "res/icons/wardrobe/basichair_invalid.png",
                id: 0
            },
            {
                normal: "res/icons/wardrobe/hair2.png",
                hover: "res/icons/wardrobe/hair2_hover.png",
                invalid: "res/icons/wardrobe/hair2_invalid.png",
                id: 1
            }
        ]

        // Request the wardrobe data so we can cache it for later
        this.requestWardrobeData();
    },
    update: function()
    {
        // Don't update if hair state not loaded yet
        if (this.hair_state === null) return;
        // If we click a button, change our style
        let counter = 0;
        for (let i in wardrobe.icons) {
            let icon = wardrobe.icons[i];
            let x = input.mouse.x;
            let y = input.mouse.y;
            if (x > 100 + 120 * counter && x < 100 + 120 * counter + 120 && y > 100 && y < 100 + 120)
            {
                // Makes sure the item is unlocked if we want to change to it
                if (counter === 0 || this.hair_state.unlocked.find(id => id == icon.id) !== undefined)
                {
                    ui.setCanSelect();
                    if (input.mouse.clicked) 
                    {
                        var command = {
                            "command": "style",
                            "id": session.id,
                            "name": session.name,
                            "item": icon.id
                        };
                        socket.send(command);
                        var command = {
                            "command": "wardrobe",
                            "id": session.id,
                            "name": session.name
                        }
                        socket.send(command);
                        return true;
                    }
                }
                return false;
            }
            counter = counter + 1;
        }
        return false;
    },
    draw: function()
    {
        // Don't draw if hair state not loaded yet
        if (this.hair_state === null) return;
        let counter = 0;
        for (let i in wardrobe.icons)
        {
            let icon = wardrobe.icons[i];
            if (this.hair_state.current == icon.id)
            {
                graphics.drawImage(graphics.loadImage(icon.hover), 100 + 120 * counter, 100, 120, 120);
            }
            else
            {
                if (counter === 0 || this.hair_state.unlocked.find(id => id == icon.id) !== undefined)
                {
                    graphics.drawImage(graphics.loadImage(icon.normal), 100 + 120 * counter, 100, 120, 120);
                }
                else
                {
                    graphics.drawImage(graphics.loadImage(icon.invalid), 100 + 120 * counter, 100, 120, 120);
                }
            }
            counter = counter + 1;
        }
    },
    requestWardrobeData: function()
    {
        var command = {
            "command": "wardrobe",
            "id": session.id,
            "name": session.name
        }
        socket.send(command);
    },
    setWardrobe: function(data)
    {
        this.hair_state = data.hair;
    }
};