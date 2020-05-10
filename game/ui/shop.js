"use strict";

let shop = {
    // Textures
    background: null,
    buy_hair_texture: null,
    buy_hair_texture_2: null,
    init: function()
    {
        shop.background = graphics.loadImage("res/ui/shop.png");
        shop.buy_hair_texture = graphics.loadImage("res/ui/buy_hair_1.png");
        shop.buy_hair_texture_2 = graphics.loadImage("res/ui/buy_hair_2.png");
    },
    update: function()
    {
        let item = inventory.getInventoryItemAtPos(input.mouse.x, input.mouse.y);
        if (item)
        {
            // Somehow set the cursor
            ui.setCanSell();
            if (input.mouse.clicked)
            {
                let index = inventory.getInventoryIndexAtPos(input.mouse.x, input.mouse.y);
                // Sell the item by looking at the index
                var command = {
                    "command": "sell",
                    "id": session.id,
                    "name": session.name,
                    "index": index
                }
                socket.send(command);
                return true;
            }
        }
        // Check if we bought hair
        let x = input.mouse.x;
        let y = input.mouse.y;
        if (x > 95 && x < 95 + 335 && y > 95 && y < 95 + 80) {
            if (input.mouse.clicked)
            {
                var command = {
                    "name": session.name,
                    "id": session.id,
                    "command": "buy",
                    "item": 0
                }
                socket.send(command);
                return true;
            }
            ui.setCanSelect();
        }
        if (x > 95 && x < 95 + 335 && y > 95 + 85 && y < 95 + 85 + 80) {
            if (input.mouse.clicked)
            {
                var command = {
                    "name": session.name,
                    "id": session.id,
                    "command": "buy",
                    "item": 1
                }
                socket.send(command);
                return true;
            }
            ui.setCanSelect();
        }
        return false;
    },
    draw: function()
    {
        graphics.drawImage(shop.background, 90, 90, 345, 515);
        graphics.drawImage(shop.buy_hair_texture, 90 + 5, 90 + 5, 335, 80);
        graphics.drawImage(shop.buy_hair_texture_2, 90 + 5, 90 + 5 + 80 + 5, 335, 80);
        // Also draw the inventory
        inventory.draw();
    }
}