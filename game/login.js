"use strict";

let login = {
    name_input: null,
    waiting: false,
    init: function() 
    {
        document.getElementById("canvases").style.display = "none";
        document.getElementById("play_button").onclick = function() {
            login.try_login();
        };
    },
    close: function() 
    {
        document.getElementById("login").style.display = "none";
        document.getElementById("canvases").style.display = "block";
    },
    update: function() 
    {
        // Enter key
        if (input.keyPressed(13) && !this.waiting)
        {
            login.try_login();
        }
        // Ideally, we want to separate out socket code from engine reliance
        socket.update();
    },
    draw: function()
    {
        // login doesn't use webGL
    },
    try_login: function()
    {
        this.waiting = true;
        document.getElementById("login").style.cursor = "wait";

        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;

        session.try_login(username, password);
    },
    login: function(session_id)
    {
        this.waiting = false;
        document.getElementById("login").style.cursor = "auto";

        session.login(session_id);

        audio.playTrack("res/music/background.wav");
        engine.setState(game);
    },
    failed: function(type)
    {
        this.waiting = false;
        document.getElementById("login").style.cursor = "auto";

        if (type == 1)
        {
            logger.error("Session already exists");
        }
        else if(type == 2)
        {
            logger.error("Incorrect password");
        }
    }
}