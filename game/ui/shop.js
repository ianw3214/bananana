"use strict";

let shop = {
    // Textures
    background: null,
    init: function()
    {
        shop.background = graphics.loadImage("res/ui/shop.png");
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
            }
        }
    },
    draw: function()
    {
        graphics.drawImage(shop.background, 90, 90, 345, 515);
        // Also draw the inventory
        inventory.draw();
    }
}