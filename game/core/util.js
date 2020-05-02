"use strict";

// Rectangles are represented by JSON objects
// Example rectangle
// { "x": 0, "y": 0, "w": 0, "h": 0}

let createRect = function(x, y, w, h)
{
    return {
        "x": x,
        "y": y,
        "w": w,
        "h": h
    };
}

let pointInRect = function(x, y, rect)
{
    return x >= rect["x"] && x <= rect["x"] + rect["w"] && y >= rect["y"] && y <= rect["y"] + rect["h"];
}