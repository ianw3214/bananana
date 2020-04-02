"use strict";

// All of this code is temporary for fishing right now
let ui = {
    fish: "",
    init: function() {
        // Do nothing...
    },
    update: function(delta)
    {
        if (ui.fish.length > 0)
        {
            if (input.mouse.clicked)
            {
                logger.warning(ui.fish);
                ui.fish = "";
            }
        }
    },
    draw: function()
    {
        if (ui.fish.length > 0)
        {
            graphics.text.drawText("You caught a " + ui.fish, defaultFont, 100, 200, 16);
        }
    },
    setFish: function(fish)
    {
        ui.fish = fish;
    }
}