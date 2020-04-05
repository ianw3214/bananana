// There are some big difficulties in writing to files from javascript
// Thus, the logger will just store the logging information
// and output in whatever form specified from the user

// A possible way to output it is via external HTML elements
// Simply using console.log may work as a temporary solution

"use strict";

let logger = {
    logs: []
};

logger.info = function (message) {
    message = "[INFO] " + message;
    console.log(message);
    logger.logs.push(message);
};

logger.warning = function (message) {
    message = "[WARNING] " + message;
    console.log("%c" + message, "color:orange;");
    logger.logs.push(message);
};

logger.error = function (message) {
    if (message)
    {
        message = "[ERROR] " + message;
        console.log("%c" + message, "color:red;");
        alert(message);
        logger.logs.push(message);    
    }
}