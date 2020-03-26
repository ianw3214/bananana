"use strict";

let menu = {
    init: function () {
        // menu.tex = graphics.loadImage("res/menu/background.png");
    },
    close: function () {
        // Clean up any resources here...
    },
    update: function () {
        if (input.keyPressed(13) || input.keyPressed(32)) {
            // DO THINGS DEPENDING ON THE MENU STATE
            // SPACE BAR
        }
        if (input.keyPressed(87) || input.keyPressed(38)) {
            // UP
        }
        if (input.keyPressed(83) || input.keyPressed(40)) {
            // DOWN
        }
    },
    draw: function () {
        // DRAW THE BACKGROUND
        // graphics.drawImage(menu.tex, 0, 0, 640, 480);
    }
}

// Function to represent entry point
function main() {
    engine.init();
    engine.start(menu);

    {
        // TESTING SOME WEBSOCKET STUFF
        var socket = new WebSocket("wss://banabanana.herokuapp.com/0.0.0.0");
        socket.onmessage = function (event) {
            console.log(event.data);
        }
        socket.onclose = function (event) {
            console.log("Error occurred.");
        }
    }
}

main();