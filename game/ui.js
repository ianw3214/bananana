"use strict";

// All of this code is temporary for fishing right now
let ui = {
    // Textures
    inventory_icon_texture: null,
    inventory_hover_texture: null,
    // icons
    banana_texture: null,
    cursor_texture: null,
    cursor_select: null,
    cursor_sell: null,
    // UI State
    fish: "",
    show_inventory: false,
    inventory_hover: false,
    cursor_can_select: false,
    cursor_can_sell: false,
    money: 0,
    show_shop: false,
    // Actual UI functions
    init: function() {
        ui.inventory_icon_texture = graphics.loadImage("res/icons/inventory.png");
        ui.inventory_hover_texture = graphics.loadImage("res/icons/inventory_select.png");

        // Hide the cursor
        document.getElementById('glCanvas').style.cursor = 'none';
        ui.banana_texture = graphics.loadImage("res/ui/banana.png");
        ui.cursor_texture = graphics.loadImage("res/ui/cursor.png");
        ui.cursor_select = graphics.loadImage("res/ui/cursor_select.png");
        ui.cursor_sell = graphics.loadImage("res/ui/cursor_sell.png");

        inventory.init();
        shop.init();

        // Request the info needed to fully render UI at the beginning
        socket.send({
            "command": "money",
            "id": session.id
        });
    },
    update: function(delta)
    {
        // Reset state
        ui.inventory_hover = false;
        // Hotbar buttons
        var inventory_rect = createRect(50, 620, 100, 100);
        // if (input.mouse.x > 50 && input.mouse.x < 50 + 100 && input.mouse.y > 720 - 100 && input.mouse.y < 720)
        if (pointInRect(input.mouse.x, input.mouse.y, inventory_rect))
        {
            if (input.mouse.clicked) 
            {
                var command = {
                    "command": "inventory",
                    "id": session.id,
                    "name": session.name
                }
                socket.send(command);
                return true;
            }
            ui.inventory_hover = true;
            ui.setCanSelect();
        }
        if (ui.show_inventory)
        {
            inventory.update();
        }
        if (ui.show_shop)
        {
            shop.update();
        }
        if (input.mouse.clicked) 
        {
            // If fish caught UI is showing
            if (ui.fish.length > 0) {
                ui.fish = "";
                return true;
            }
            // Assume if inventory is shown, the cache is not null
            if (ui.show_inventory) 
            {
                ui.show_inventory = false;
                return true;
            }
            if (ui.show_shop) 
            {
                ui.show_shop = false;
                return true;
            }
        }
        return false;
    },
    draw: function()
    {
        // Draw hotbar
        if (ui.inventory_hover)
        {
            graphics.drawImage(ui.inventory_hover_texture, 50, 720 - 100, 100, 100);
        }
        else
        {
            graphics.drawImage(ui.inventory_icon_texture, 50, 720 - 100, 100, 100);
        }
        // draw fish if fishing
        if (ui.fish.length > 0)
        {
            graphics.text.drawText("You caught a " + ui.fish, defaultFont, 100, 200, 16);
        }
        // Draw inventory if showing
        if (ui.show_inventory)
        {
            inventory.draw();
        }
        // Draw shop UI
        if (ui.show_shop) {
            shop.draw();
        }
        // Draw moneysss
        graphics.drawImage(ui.banana_texture, 0, 0, 60, 60);
        graphics.text.drawText(ui.money.toString(), defaultFont, 60, 5, 50);
        // Draw the cursor
        if (ui.cursor_can_sell)
        {
            graphics.drawImage(ui.cursor_sell, input.mouse.x, input.mouse.y, 35, 35);
            // Reset the state after
            ui.cursor_can_sell = false;
        }
        else if (ui.cursor_can_select)
        {
            graphics.drawImage(ui.cursor_select, input.mouse.x, input.mouse.y, 35, 35);
            // Reset the state after
            ui.cursor_can_select = false;
        }
        else
        {
            graphics.drawImage(ui.cursor_texture, input.mouse.x, input.mouse.y, 35, 35);
        }
    },
    setFish: function(fish)
    {
        ui.fish = fish;
    },
    setInventory: function(data)
    {
        ui.show_inventory = true;
        inventory.setInventory(data);
    },
    setMoney: function(money)
    {
        ui.money = money;
    },
    // TODO: Probably don't want simple getter/setters, inoptimal
    setCanSelect: function()
    {
        ui.cursor_can_select = true;
    },
    setCanSell: function()
    {
        ui.cursor_can_sell = true;
    },
    openShop: function()
    {
        ui.show_shop = true;
    }
}