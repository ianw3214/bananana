"use strict";
// TODO: DEFINES for key codes maybe?

// REFERENCE TO THE CANVAS
let canvas = document.getElementById("glCanvas");

let input = {
    keys: [],
    mouse: {
        x: 0,
        y: 0,
        clicked: false,
        held: true,
        session: false
    },
    record_text: false,
    recorded_text: ""
};

input.init = function () {
    document.addEventListener("keydown", input.keyDownHandler, false)
    document.addEventListener("keyup", input.keyUpHandler, false);
    document.addEventListener("mousemove", input.updateMousePos, false);
    document.addEventListener("mousedown", input.mouseDown, false);
    document.addEventListener("mouseup", input.mouseUp, false);
}

input.update = function(delta) {
    // Reset mouse state
    input.mouse.clicked = false;

    if (input.mouse.held)
    {
        if (!input.mouse.session)
        {
            input.mouse.session = true;
            input.mouse.clicked = true;
        }
    }
    else
    {
        input.mouse.session = false;
    }
}

input.keyDownHandler = function (event) {
    // LOG THE KEYCODE IF SHIFT IS PRESSED (for debugging)
    if (input.keyPressed(16)) {
        console.log("KEY PRESSED: " + event.keyCode);
    }
    if (!input.keyPressed(event.keyCode)) 
    {
        input.keys.push(event.keyCode);
        if (input.record_text) 
        {
            // Backspace
            if (event.keyCode === 8)
            {
                input.recorded_text = input.recorded_text.substring(0, input.recorded_text.length - 1);
            }
            // Handle any remaining character that is supported
            else
            {
                var char = String.fromCharCode(event.keyCode);
                if (graphics.text.characterSupported(char));
                {
                    input.recorded_text = input.recorded_text.concat(char);
                }
            }
        }
    }
}

input.keyUpHandler = function (event) {
    input.keys = input.keys.filter(e => e != event.keyCode);
}

input.keyPressed = function (key) {
    return input.keys.indexOf(key) >= 0;
}

input.updateMousePos = function (evt) {
    let rect = canvas.getBoundingClientRect();
    input.mouse.x = (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
    // Invert mouse y
    input.mouse.y = (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;
}

input.mouseDown = function (event) {
    input.mouse.held = true;
}

input.mouseUp = function (event) {
    input.mouse.held = false;
}

input.startRecordText = function()
{
    input.record_text = true;
}

input.stopRecordText = function()
{
    input.record_text = false;
}

input.resetRecordText = function()
{
    input.recorded_text = "";
}