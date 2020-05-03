"use strict";

let inventory = {
    // Textures
    background: null,
    // Fish textures
    goldfish_texture: "res/ui/goldfish.png",
    carp_texture: "res/ui/common_carp.png",
    clownfish_texture: "res/ui/clownfish.png",
    catfish_texture: "res/ui/catfish.png",
    swordfish_texture: "res/ui/swordfish.png",
    salmon_texture: "res/ui/salmong.png",
    cod_texture: "res/ui/large_cod.png",
    sergio_texture: "res/ui/sergio.png",
    // Inventory state
    inventory_cache: null,
    init: function()
    {
        inventory.background = graphics.loadImage("res/ui/inventory.png");
        // Load fish textures
        inventory.goldfish_texture = graphics.loadImage("res/ui/goldfish.png");
        inventory.carp_texture = graphics.loadImage("res/ui/common_carp.png");
        inventory.clownfish_texture = graphics.loadImage("res/ui/clownfish.png");
        inventory.catfish_texture = graphics.loadImage("res/ui/catfish.png");
        inventory.swordfish_texture = graphics.loadImage("res/ui/swordfish.png");
        inventory.salmon_texture = graphics.loadImage("res/ui/salmong.png");
        inventory.cod_texture = graphics.loadImage("res/ui/large_cod.png");
        inventory.sergio_texture = graphics.loadImage("res/ui/sergio.png");
    },
    update: function()
    {
    },
    draw: function()
    {
        graphics.drawImage(inventory.background, 490, 90, 345, 515);
        var counter = 0;
        for (var item in inventory.inventory_cache) {
            item = inventory.inventory_cache[item];
            if (item !== "root") {
                var texture = null;
                if (item == "GOLDFISH") texture = this.goldfish_texture;
                if (item == "COMMON CARP") texture = this.carp_texture;
                if (item == "CLOWNFISH") texture = this.clownfish_texture;
                if (item == "CATFISH") texture = this.catfish_texture;
                if (item == "SWORDFISH") texture = this.swordfish_texture;
                if (item == "SALMON") texture = this.salmon_texture;
                if (item == "LARGE COD") texture = this.cod_texture;
                if (item == "SERGIO") texture = this.sergio_texture;
                if (texture !== null) {
                    var x = 490 + (counter % 4) * 85 + 5;
                    var y = 90 + (Math.floor(counter / 4)) * 85 + 5;
                    graphics.drawImage(texture, x, y, 80, 80);
                    counter = counter + 1;
                }
            }
        }
    },
    setInventory: function (data) 
    {
        inventory.inventory_cache = data;
    },
    getInventoryIndexAtPos(x, y)
    {
        // Take margins into account
        let x_offset = x - 490 - 5;
        let y_offset = y - 90 - 5;
        if (x_offset < 0 || y_offset < 0) return null;
        x_offset = Math.floor(x_offset / 85);
        y_offset = Math.floor(y_offset / 85);
        // If we are out of bounds, then definitely no item
        if (x_offset >= 4) return null;
        // Take into account the 'root' element at pos 0
        return y_offset * 4 + x_offset + 1;
    },
    getInventoryItemAtPos(x, y)
    {
        let index = inventory.getInventoryIndexAtPos(x, y);
        if (inventory.inventory_cache && index < inventory.inventory_cache.length)
        {
            return inventory.inventory_cache[index];
        }
        return null;
    }
}