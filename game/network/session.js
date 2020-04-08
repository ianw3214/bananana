"use strict";

let session = {
    id: null,
    name: null,
    new: function(name)
    {
        session.id = Math.floor(Math.random() * 100000);
        session.name = name;

        socket.send({
            "command": "create",
            "id": session.id,
            "name": name
        })
    }
}