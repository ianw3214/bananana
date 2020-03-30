"use strict";

let game = {
    // Input state
    mouse_session: true,
    // Textures
    background: null,
    init: function () {
        // menu.tex = graphics.loadImage("res/menu/background.png");
        game.background = graphics.loadImage("res/background.png");
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
        if (input.mouse.clicked)
        {
            if (!game.mouse_session)
            {
                game.mouse_session = true;
                // Move here
                var command = {
                    "command": "move",
                    "id": players.id,
                    "x": input.mouse.x,
                    "y": input.mouse.y
                };
                socket.send(JSON.stringify(command));
            }
        }
        else
        {
            game.mouse_session = false;
        }
        players.update();
        socket.update();
    },
    draw: function () {
        // DRAW THE BACKGROUND
        graphics.drawImage(game.background, 0, 0, 640, 480);

        players.draw();

        graphics.text.drawText("VERSION 0-0-1");
    }
}

// Function to represent entry point
function main() {
    engine.init();
    engine.start(game);
}

main();