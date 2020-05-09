"use strict";

// Wrapper around websockets
let socket = {
    socket: null,
    messages: [],
    init: function() {
        socket.socket = new WebSocket("wss://banabanana.herokuapp.com/0.0.0.0");
        // socket.socket = new WebSocket("ws://127.0.0.1:5678");
        socket.socket.onmessage = function(event)
        {
            // Assume incoming data is always JSON data
            var data = JSON.parse(event.data);
            if (data["messages"])
            {
                for (var message in data["messages"])
                {
                    message = data["messages"][message];
                    socket.handleMessage(message);
                }
            }
            else
            {
                socket.handleMessage(data);
            }
        }
        socket.socket.onclose = function(event)
        {
            logger.info("Socket closed!");
        }
        socket.socket.onopen = function(event)
        {
            logger.info("Socket successfully opened!");
        }
    },
    update: function(message)
    {
        if (socket.socket.readyState == WebSocket.OPEN)
        {
            for (message in socket.messages) {
                message = socket.messages[message];
                socket.socket.send(message);
            }
            socket.messages = [];
        }
    },
    send: function(message)
    {
        if (typeof(message) === "string")
        {
            socket.messages.push(message);
        }
        else if (typeof(message) === "object")
        {
            socket.messages.push(JSON.stringify(message));
        }
        else
        {
            logger.error("Not a supported message type to send over socket: " + typeof(message));
        }
    },
    handleMessage: function(message)
    {
        // Assume message is already in JSON format
        if (message["command"] == "login")
        {
            if (message["success"] === true)
            {
                login.login(message["id"]);
            }
            else
            {
                login.failed();
            }
        }
        if (message["command"] == "create")
        {
            players.createPlayer(message);
        }
        if (message["command"] == "move")
        {
            players.movePlayer(message);
        }
        if (message["command"] == "remove")
        {
            players.removePlayer(message);
        }
        if (message["command"] == "interact")
        {
            if (message["action"] == "fishing")
            {
                var player = players.getPlayer(message["id"]);
                if (player !== null)
                {
                    player["state"] = "fishing";
                }
            }
        }
        if (message["command"] == "fish")
        {
            var player = players.getPlayer(message["id"])
            if (player !== null)
            {
                player["state"] = "default";
            }
            // If this is us, show the fish
            if (message["id"] == session.id)
            {
                ui.setFish(message["fish"]);
            }
        }
        if (message["command"] == "inventory")
        {
            inventory.setInventory(message["inventory"]);
        }
        if (message["command"] == "wardrobe")
        {
            wardrobe.setWardrobe(message["wardrobe"]);
        }
        if (message["command"] == "money")
        {
            ui.setMoney(message["money"]);
        }
        if (message["command"] == "style")
        {
            players.setPlayerStyle(message["id"], message["item"])
        }
        if (message["debug"])
        {
            if (typeof(message["debug"]) === "object")
            {
                logger.info(JSON.stringify(message["debug"]));
            }
            else
            {
                logger.info(message["debug"]);
            }
        }
    }
}