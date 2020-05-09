"use strict";

let login = {
    name_input: null,
    waiting: false,
    init: function() 
    {
        document.getElementById("glCanvas").style.display = "none";
        document.getElementById("play_button").onclick = function() {
            login.try_login();
        };
    },
    close: function() 
    {
        document.getElementById("login").style.display = "none";
        document.getElementById("glCanvas").style.display = "block";
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
    failed: function()
    {
        this.waiting = false;
        document.getElementById("login").style.cursor = "auto";

        logger.error("Login failed");
    }
}