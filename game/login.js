"use strict";

let login = {
    name_input: null,
    init: function() 
    {
        document.getElementById("glCanvas").style.display = "none";
        document.getElementById("play_button").onclick = function() {
            login.login();
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
        if (input.keyPressed(13))
        {
            login.login();
        }
    },
    draw: function()
    {
        graphics.drawRect(0, 0, 960, 720, [1.0, 1.0, 1.0, 1.0]);
        graphics.text.drawText("Login", defaultFont, 100, 20, 32, [0.0, 0.0, 0.0, 1.0]);
        graphics.text.drawText("type your username and press \nenter to start", defaultFont, 100, 60, 16, [0.0, 0.0, 0.0, 1.0]);

        graphics.text.drawText("Name", defaultFont, 100, 160, 24, [0.0, 0.0, 0.0, 1.0]);

        if (input.recorded_text)
        {
            graphics.text.drawText(input.recorded_text, defaultFont, 220, 160, 24, [0.2, 0.2, 0.2, 1.0]);
        }
    },
    login: function()
    {
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;

        session.new(username);

        audio.playTrack("res/music/background.wav");
        engine.setState(game);
    }
}