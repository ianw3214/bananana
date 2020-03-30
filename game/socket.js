"use strict";

// Wrapper around websockets
let socket = {
    socket: null,
    messages: [],
    init: function() {
        socket.socket = new WebSocket("wss://banabanana.herokuapp.com/0.0.0.0");
        socket.socket.onmessage = function(event)
        {
            // Assume incoming data is always JSON data
            var data = JSON.parse(event.data);
            socket.handleMessage(data);
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
    }
}