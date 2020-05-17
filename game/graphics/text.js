"use strict";

graphics.text = {
    context: null,
    init: function()
    {
        // look up the text canvas and make a 2d context for it
        var textCanvas = document.querySelector("#textCanvas");
        this.context = textCanvas.getContext("2d");

        // Initialize fonts
        this.context.textBaseline = 'top';
    },
    drawText: function (text, x = 0, y = 0, size = 16, colour = [1.0, 1.0, 1.0, 1.0])
    {
        this.context.font = size.toString() + 'px sans-serif';
        this.context.fillText(text, x, y);
    },
    clearBuffer: function()
    {
        // Clear the 2D canvas
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    }
}