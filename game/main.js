"use strict";

let game = {
    draw_objects: [],
    // Textures
    background: null,
    init: function () {
        map.init();
        socket.init();
        players.init();
        ui.init();
    },
    close: function () {
        // Clean up any resources here...
    },
    update: function (delta) {
        if (input.keyPressed(13) || input.keyPressed(32)) {
            // DO THINGS DEPENDING ON THE MENU STATE
            // SPACE BAR
        }
        if (input.keyPressed(87) || input.keyPressed(38)) {
            // UP
        }
        if (input.keyPressed(83) || input.keyPressed(40)) {
            // DOWN
        }
        var map_click_handled = false;
        map_click_handled = ui.update(delta);
        map_click_handled = map.update(map_click_handled);
        players.update(map_click_handled);
        socket.update();
    },
    draw: function () {
        map.draw();
        players.draw();

        game.draw_objects.sort(function (a, b) { return a.y + a.h - b.y - b.h });
        game.draw_objects.sort(function (a, b) { return a.z - b.z });
        for (let i in game.draw_objects) {
            let obj = game.draw_objects[i];
            // Will need drawImageSource when implementing animations
            graphics.drawImage(
                obj.texture,
                obj.x,
                obj.y,
                obj.w,
                obj.h
            );
            /*
            if (obj.type === "square") {
                let color = error_color;
                if (obj.color !== null && obj.color !== undefined) color = obj.color;
                graphics.drawRect(obj.x, obj.y, obj.w, obj.h, color);
            }
            if (obj.type === "line") {
                // TODO: Implement this
            }
            */
        }
        game.draw_objects = [];

        ui.draw();
        graphics.text.drawText("VERSION 0.0.7", defaultFont, graphics.width() - 300, graphics.height() - 16, 12);
    },
    drawTexture(texture, x, y, w, h, z = 0)
    {
        this.draw_objects.push({"texture": texture, "x": x, "y": y, "w": w, "h": h, "z": z});
    }
}

// Function to represent entry point
function main() {
    engine.init();
    // engine.start(game);
    engine.start(login);
}

main();