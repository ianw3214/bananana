"use strict";

let login = {
    name_input: null,
    init: function() 
    {
        input.startRecordText();   
    },
    close: function() 
    {
        input.stopRecordText();
        session.new(input.recorded_text);
        input.resetRecordText();
    },
    update: function() 
    {
        // Enter key
        if (input.keyPressed(13))
        {
            engine.setState(game);
        }
    },
    draw: function()
    {
        graphics.drawRect(0, 0, 640, 480, [1.0, 1.0, 1.0, 1.0]);
        graphics.text.drawText("Login", defaultFont, 100, 20, 32, [0.0, 0.0, 0.0, 1.0]);
        graphics.text.drawText("type your username and press \nenter to start", defaultFont, 100, 60, 16, [0.0, 0.0, 0.0, 1.0]);

        graphics.text.drawText("Name", defaultFont, 100, 160, 24, [0.0, 0.0, 0.0, 1.0]);

        if (input.recorded_text)
        {
            graphics.text.drawText(input.recorded_text, defaultFont, 220, 160, 24, [0.2, 0.2, 0.2, 1.0]);
        }
    }
}