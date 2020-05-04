"use strict";

let players = {
    // Textures
    player_texture: null,
    player_flip_texture: null,
    player_move_right_texture: null,
    player_move_left_texture: null,
    player_fishing_texture: null,
    hair_texture: null,
    hair_flip_texture: null,
    //////////////////////////////////////////////////
    players: [],
    //////////////////////////////////////////////////
    delta_accum: 0,
    //////////////////////////////////////////////////
    init: function() 
    {
        players.player_texture = graphics.loadImage("res/player.png");              // Normally the player faces right
        players.player_flip_texture = graphics.loadImage("res/player_flip.png");
        players.player_move_right_texture = graphics.loadImage("res/player_move_right.png");
        players.player_move_left_texture = graphics.loadImage("res/player_move_left.png");
        players.player_fishing_texture = graphics.loadImage("res/player_fish.png");
        players.hair_texture = graphics.loadImage("res/player/hair1.png");
        players.hair_flip_texture = graphics.loadImage("res/player/hair1_flip.png");
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
                    player["faceright"] = x_offset > 0;
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
                if (player["x"] === player["target_x"] && player["y"] === player["target_y"])
                {
                    if (player["state"] === "move")
                    {
                        player["state"] = "idle";
                    }
                }
            }
        }
    },
    draw: function(delta)
    {
        players.delta_accum = players.delta_accum + delta;
        let update_anim = players.delta_accum >= 1000 / 12;
        if (update_anim) players.delta_accum = 0;
        for (var player in players.players) 
        {
            player = players.players[player];
            let draw_x = player["x"] - 50;
            let draw_y = player["y"] - 150;
            if (player["state"] === "fishing")
            {
                game.drawTexture(players.player_fishing_texture, draw_x, draw_y, 100, 150);
            }
            else if (player["state"] == "move")
            {
                // Update frame stats before rendering
                if (player["curr_anim_frame"] >= 4) player["curr_anim_frame"] = 0;
                let frame = player["curr_anim_frame"];
                if (update_anim) player["curr_anim_frame"] = player["curr_anim_frame"] + 1;
                // For now, animations are hard coded
                let source = {
                    "target": {
                        "x": 400 * frame,
                        "y": 0,
                        "w": 400,
                        "h": 600
                    },
                    "w": 1600,
                    "h": 600
                }
                if (player["faceright"] === true)
                {
                    game.drawTextureSource(players.player_move_right_texture, source, draw_x, draw_y, 100, 150);
                }
                else
                {
                    game.drawTextureSource(players.player_move_left_texture, source, draw_x, draw_y, 100, 150);
                }
            }
            else
            {
                if (player["faceright"] === true)
                {
                    game.drawTexture(players.player_texture, draw_x, draw_y, 100, 150);
                }
                else
                {
                    game.drawTexture(players.player_flip_texture, draw_x, draw_y, 100, 150);
                }
            }
            if (player["hair"] == 0)
            {
                // For now the fishing animations only face right so set that for the hair as well
                if (player["faceright"] || player["state"] === "fishing")
                {
                    game.drawTextureOffset(players.hair_texture, draw_x, draw_y - 2, 100, 70, 150 - 70 + 2);
                }
                else
                {
                    game.drawTextureOffset(players.hair_flip_texture, draw_x, draw_y - 2, 100, 70, 150 - 70 + 2);
                }
            }
            // Draw the player name
            game.drawText(player["name"], draw_x, draw_y - 16);
        }
    },
    createPlayer: function(data)
    {
        players.players.push({
            "id": data["id"],
            "name": data["name"],
            "x": data["x"],
            "y": data["y"],
            "state": data["state"],
            "hair": data["hair"],
            // client side player data 
            "target_x": data["x"],
            "target_y": data["y"],
            "faceright": true,
            "curr_anim_frame": 0
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
                player["state"] = "move";
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
        if (input.mouse.clicked && map_click_handled !== true) 
        {
            // Make sure we are in bounds
            if (input.mouse.x > 0 && input.mouse.x < 960 && input.mouse.y > 200 && input.mouse.y < 720)
            {
                // Move here
                var command = {
                    "command": "move",
                    "id": session.id,
                    "x": input.mouse.x,
                    "y": input.mouse.y
                };
                socket.send(JSON.stringify(command));
            }
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
    },
    setPlayerStyle: function(id, item)
    {
        let player = this.getPlayer(id);
        player.hair = item;
    }
};