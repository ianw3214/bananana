"use strict";

let session = {
    id: null,
    name: null,
    try_login: function(username, password)
    {
        session.name = username;

        socket.send({
            "command": "login",
            "name": username,
            "password": sha256(password)
        });
    },
    login: function(session_id)
    {
        session.id = session_id;
    }
}