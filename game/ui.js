"use strict";

// All of this code is temporary for fishing right now
let ui = {
    // Textures
    inventory_icon_texture: null,
    inventory_hover_texture: null,
    inventory_background: null,
    // Fish textures
    goldfish_texture: "res/ui/goldfish.png",
    carp_texture: "res/ui/common_carp.png",
    clownfish_texture: "res/ui/clownfish.png",
    catfish_texture: "res/ui/catfish.png",
    swordfish_texture: "res/ui/swordfish.png",
    salmon_texture: "res/ui/salmong.png",
    cod_texture: "res/ui/large_cod.png",
    sergio_texture: "res/ui/sergio.png",
    // icons
    banana_texture: null,
    cursor_texture: null,
    // UI State
    fish: "",
    show_inventory: false,
    inventory_cache: null,
    inventory_hover: false,
    cursor_can_select: false,
    money: 0,
    // Actual UI functions
    init: function() {
        ui.inventory_icon_texture = graphics.loadImage("res/icons/inventory.png");
        ui.inventory_hover_texture = graphics.loadImage("res/icons/inventory_select.png");
        ui.inventory_background = graphics.loadImage("res/ui/inventory.png");
        // Load fish textures
        ui.goldfish_texture = graphics.loadImage("res/ui/goldfish.png");
        ui.carp_texture = graphics.loadImage("res/ui/common_carp.png");
        ui.clownfish_texture = graphics.loadImage("res/ui/clownfish.png");
        ui.catfish_texture = graphics.loadImage("res/ui/catfish.png");
        ui.swordfish_texture = graphics.loadImage("res/ui/swordfish.png");
        ui.salmon_texture = graphics.loadImage("res/ui/salmong.png");
        ui.cod_texture = graphics.loadImage("res/ui/large_cod.png");
        ui.sergio_texture = graphics.loadImage("res/ui/sergio.png");

        // Hide the cursor
        document.getElementById('glCanvas').style.cursor = 'none';
        ui.banana_texture = graphics.loadImage("res/ui/banana.png");
        ui.cursor_texture = graphics.loadImage("res/ui/cursor.png");
        ui.cursor_select = graphics.loadImage("res/ui/cursor_select.png");

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
        if (input.mouse.x > 50 && input.mouse.x < 50 + 100 && input.mouse.y > 720 - 100 && input.mouse.y < 720)
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
        if (ui.fish.length > 0)
        {
            if (input.mouse.clicked)
            {
                ui.fish = "";
                return true;
            }
        }
        // Assume if inventory is shown, the cache is not null
        if (ui.show_inventory && ui.inventory_cache.length > 0)
        {
            if (input.mouse.clicked)
            {
                ui.show_inventory = false;
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
            graphics.drawImage(ui.inventory_background, 130, 70, 522, 522);
            var counter = 0;
            for (var item in ui.inventory_cache)
            {
                item = ui.inventory_cache[item];
                if (item !== "root")
                {
                    var texture = null;
                    if (item == "GOLDFISH") texture = this.goldfish_texture;
                    if (item == "COMMON_CARP") texture = this.carp_texture;
                    if (item == "CLOWNFISH") texture = this.clownfish_texture;
                    if (item == "CATFISH") texture = this.catfish_texture;
                    if (item == "SWORDFISH") texture = this.swordfish_texture;
                    if (item == "SALMON") texture = this.salmon_texture;
                    if (item == "LARGE COD") texture = this.cod_texture;
                    if (item == "SERGIO") texture = this.sergio_texture;
                    if (texture !== null)
                    {
                        var x = 130 + (counter % 10) * 52 + 2;
                        var y = 70 + (Math.floor(counter / 10)) * 52 + 2;
                        graphics.drawImage(texture, x, y, 50, 50);
                        counter = counter + 1;
                    }
                }
            }
        }
        // Draw moneysss
        graphics.drawImage(ui.banana_texture, 0, 0, 60, 60);
        graphics.text.drawText(ui.money.toString(), defaultFont, 60, 5, 50);
        // Draw the cursor
        if (ui.cursor_can_select)
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
    setInventory: function(inventory)
    {
        ui.show_inventory = true;
        ui.inventory_cache = inventory;
    },
    setMoney: function(money)
    {
        ui.money = money;
    },
    // TODO: Probably don't want simple getter/setters, inoptimal
    setCanSelect: function()
    {
        ui.cursor_can_select = true;
    }
}