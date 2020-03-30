"use strict";

let players = {
    // Textures
    player_texture: null,
    //////////////////////////////////////////////////
    players: [],
    id: null,
    //////////////////////////////////////////////////
    init: function() 
    {
        players.player_texture = graphics.loadImage("res/player.png");

        // Create our player ID
        players.id = Math.floor(Math.random() * 100000);

        socket.send({
            "command": "create",
            "id": players.id
        });
    },
    update: function()
    {

    },
    draw: function()
    {
        for (var player in players.players) 
        {
            player = players.players[player];
            graphics.drawImage(players.player_texture, player["x"], player["y"], 100, 150);
        }
    },
    createPlayer: function(data)
    {
        players.players.push({
            "id": data["id"],
            "x": data["x"],
            "y": data["y"],
            "target_x": data["x"],
            "target_y": data["y"]
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
    }
};