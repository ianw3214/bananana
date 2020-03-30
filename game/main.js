"use strict";

let game = {
    // Input state
    mouse_session: true,
    // Textures
    background: null,
    players: [],
    id: null,
    socket: null,
    init: function () {
        // menu.tex = graphics.loadImage("res/menu/background.png");
        game.background = graphics.loadImage("res/background.png");
        game.player = graphics.loadImage("res/player.png");

        // Create our player ID and our player
        game.id = Math.random();
        console.log(game.id);

        // TESTING SOME WEBSOCKET STUFF
        game.socket = new WebSocket("wss://banabanana.herokuapp.com/0.0.0.0");
        game.socket.onmessage = function (event) {
            console.log(event.data);
            var data = JSON.parse(event.data);
            if (data["command"] == "create")
            {
                game.players.push({
                    "id": data["id"],
                    "x": data["x"],
                    "y": data["y"],
                    "target_x": data["x"],
                    "target_y": data["y"]
                });
            }
            if (data["command"] == "move")
            {
                // Find the player and move it
                for (var player in game.players)
                {
                    player = game.players[player];
                    if (player["id"] == data["id"])
                    {
                        player["target_x"] = data["x"];
                        player["target_y"] = data["y"];
                    }
                }
            }
        }
        game.socket.onclose = function (event) {
            console.log("Error occurred."); 
        }
        game.socket.onopen = function (event) {
            var create_player_command = {
                "command" : "create",
                "id" : game.id
            };
            game.socket.send(JSON.stringify(create_player_command));
        }
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
                    "id": game.id,
                    "x": input.mouse.x,
                    "y": input.mouse.y
                };
                game.socket.send(JSON.stringify(command));
            }
        }
        else
        {
            game.mouse_session = false;
        }
        // Update player positions
        for (var player in game.players)
        {
            player = game.players[player];
            if (player["x"] !== player["target_x"])
            {
                if (player["x"] < player["target_x"])
                {
                    player["x"] += 1;
                }
                else
                {
                    player["x"] -= 1;
                }
            }
            if (player["y"] !== player["target_y"]) 
            {
                if (player["y"] < player["target_y"]) 
                {
                    player["y"] += 1;
                }
                else {
                    player["y"] -= 1;
                }
            }
        }
    },
    draw: function () {
        // DRAW THE BACKGROUND
        // graphics.drawImage(menu.tex, 0, 0, 640, 480);
        graphics.drawImage(game.background, 0, 0, 640, 480);

        for (var player in game.players)
        {
            player = game.players[player];
            graphics.drawImage(game.player, player["x"], player["y"], 100, 150);
        }
    }
}

// Function to represent entry point
function main() {
    engine.init();
    engine.start(game);
}

main();