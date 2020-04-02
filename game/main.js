"use strict";

let game = {
    // Textures
    background: null,
    init: function () {
        map.init();
        socket.init();
        players.init();
    },
    close: function () {
        // Clean up any resources here...
    },
    update: function () {
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
        players.update();
        socket.update();
    },
    draw: function () {
        map.draw();
        players.draw();

        graphics.text.drawText("VERSION 0-0-2");
    }
}

// Function to represent entry point
function main() {
    engine.init();
    engine.start(game);
}

main();