"use strict";

var file = {};

file.loadJSON = function (path, callback, error_callback = undefined) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', path, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4) {
            if (xobj.status == "200") {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                callback(xobj.responseText);
            } else {
                logger.error("File failed to load: " + path);
                if (error_callback !== undefined) {
                    error_callback();
                }
            }
        }
    };
    xobj.send(null);
}