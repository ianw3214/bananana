"use strict";

let players = {
    // Textures
    player_texture: null,
    player_fishing_texture: null,
    //////////////////////////////////////////////////
    players: [],
    id: null,
    //////////////////////////////////////////////////
    init: function() 
    {
        players.player_texture = graphics.loadImage("res/player.png");
        players.player_fishing_texture = graphics.loadImage("res/player_fish.png");

        // Create our player ID
        players.id = Math.floor(Math.random() * 100000);

        // Notify the server that the client has joined the game
        socket.send({
            "command": "create",
            "id": players.id
        });
    },
    update: function(map_click_handled)
    {
        players.handleInput(map_click_handled);
        // Update player positions
        for (var player in players.players) {
            player = players.players[player];

            var x_offset = player["target_x"] - player["x"];
            var y_offset = player["target_y"] - player["y"];
            var angle = Math.atan2(y_offset, x_offset);
            
            if (x_offset != 0 || y_offset != 0)
            {
                if (x_offset > 5 || x_offset < -5)
                {
                    player["x"] += Math.ceil(Math.cos(angle) * 5.0);
                }
                else
                {
                    player["x"] = player["target_x"];
                }
                if (y_offset > 5 || y_offset < -5)
                {
                    player["y"] += Math.ceil(Math.sin(angle) * 5.0);
                }
                else
                {
                    player["y"] = player["target_y"];
                }
            }
        }
    },
    draw: function()
    {
        for (var player in players.players) 
        {
            player = players.players[player];
            if (player["state"] == "fishing")
            {
                graphics.drawImage(players.player_fishing_texture, player["x"] - 50, player["y"] - 150, 100, 150);
            }
            else
            {
                graphics.drawImage(players.player_texture, player["x"] - 50, player["y"] - 150, 100, 150);
            }
        }
    },
    createPlayer: function(data)
    {
        players.players.push({
            "id": data["id"],
            "x": data["x"],
            "y": data["y"],
            "target_x": data["x"],
            "target_y": data["y"],
            "state": data["state"]
        });
    },
    movePlayer: function(data)
    {
        // Find the player and move it
        for (var player in players.players) 
        {
            player = players.players[player];
            if (player["id"] == data["id"]) 
            {
                player["target_x"] = data["x"];
                player["target_y"] = data["y"];
            }
        }
    },
    removePlayer: function(data)
    {
        // Find the player and remove it
        for (var player in players.players)
        {
            if (players.players[player]["id"] == data["id"])
            {
                players.players.splice(player, 1);
                break;
            }
        }
    },
    handleInput: function (map_click_handled)
    {
        if (input.mouse.clicked && !map_click_handled) 
        {
            // Move here
            var command = {
                "command": "move",
                "id": players.id,
                "x": input.mouse.x,
                "y": input.mouse.y
            };
            socket.send(JSON.stringify(command));
        }
    },
    getPlayer: function(id)
    {
        for (var player in players.players)
        {
            if (players.players[player]["id"] == id)
            {
                return players.players[player];
            }
        }
        return null;
    }
};