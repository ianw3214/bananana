"use strict";

let graphics = {
    fullscreen_callbacks: []
};
// TODO: Maybe cache vertex buffers and stuff for optimization

// Simple vertex shader for 2D drawing
const vertex = `
    precision highp float;

    attribute vec2 a_pos;
    attribute vec2 a_tex;
    
    uniform float u_screenWidth;
    uniform float u_screenHeight;

    varying vec2 v_texCoord;

    void main() {
        float x = (a_pos.x / u_screenWidth) * 2.0 - 1.0;
        float y = -((a_pos.y / u_screenHeight) * 2.0 - 1.0);
        gl_Position = vec4(x, y, 0.0, 1.0);

        v_texCoord = a_tex;
    }`;

const fragment = `   
    precision mediump float;
    uniform vec4 u_colour;
    void main() {
        gl_FragColor = u_colour;
    }`;

const texture = `
    precision mediump float;
    uniform sampler2D u_image;
    varying vec2 v_texCoord;
    void main() {
        gl_FragColor = texture2D(u_image, v_texCoord);
    }`;

// GLOBAL VARIABLES
let gl;
let texture_cache = {};

// SHADERS
let shader_program;
let texture_shader;

// CONSTANTS
const full_rect = new Float32Array([
    0.0, 0.0,
    1.0, 0.0,
    0.0, 1.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0,]);
const error_colour = [1.0, 0.0, 1.0, 1.0];

// Initialize webGL
graphics.init = function() {
    const canvas = document.querySelector("#glCanvas");
    gl = canvas.getContext("webgl");
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    if (!gl) {
        logger.error("Unable to intiialize webGL");
        return;
    }

    shader_program = graphics.createShaderProgram(vertex, fragment);
    gl.useProgram(shader_program);
    gl.uniform1f(gl.getUniformLocation(shader_program, "u_screenWidth"), gl.canvas.clientWidth);
    gl.uniform1f(gl.getUniformLocation(shader_program, "u_screenHeight"), gl.canvas.clientHeight);
    texture_shader = graphics.createShaderProgram(vertex, texture);
    gl.useProgram(texture_shader);
    gl.uniform1f(gl.getUniformLocation(texture_shader, "u_screenWidth"), gl.canvas.clientWidth);
    gl.uniform1f(gl.getUniformLocation(texture_shader, "u_screenHeight"), gl.canvas.clientHeight);
}

graphics.resize = function() {
    // Lookup the size the browser is displaying the canvas.
    let canvas = document.getElementById("glCanvas");
    let displayWidth = canvas.clientWidth;
    let displayHeight = canvas.clientHeight;

    // Check if the canvas is not the same size.
    if (canvas.width != displayWidth || canvas.height != displayHeight) {
        // Make the canvas the same size
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
    
    // Also update shader uniforms
    gl.useProgram(shader_program);
    gl.uniform1f(gl.getUniformLocation(shader_program, "u_screenWidth"), displayWidth);
    gl.uniform1f(gl.getUniformLocation(shader_program, "u_screenHeight"), displayHeight);
    gl.useProgram(texture_shader);
    gl.uniform1f(gl.getUniformLocation(texture_shader, "u_screenWidth"), displayWidth);
    gl.uniform1f(gl.getUniformLocation(texture_shader, "u_screenHeight"), displayHeight);
}

graphics.setFullscreen = function() {
    document.getElementById("glCanvas").requestFullscreen().catch(err => {
        logger.warning("Unable to request fullscreen");
    });
}

graphics.exitFullscreen = function() {
    if (document.fullscreen) {
        document.exitFullscreen();
    }
}

graphics.addFullscreenCallback = function(callback) {
    if (typeof callback !== "function") {
        logger.warning("Trying to push a fullscreen callback that isn't a function");
    } else {
        graphics.fullscreen_callbacks.push(callback);
    }
}

document.onfullscreenchange = function (event) {
    let canvas = document.getElementById("glCanvas");
    // IF THE DOCUMENT IS NO LONGER FULLSCREEN, THEN EXITING FULLSCREEN
    if (!document.fullscreenElement) {
        canvas.width = 640;
        canvas.height = 480;
    }
    graphics.resize();
    let width = canvas.width;
    let height = canvas.height;
    gl.viewport(0, 0, width, height);

    // Call any fullscreen callbacks
    for (let i in graphics.fullscreen_callbacks) {
        graphics.fullscreen_callbacks[i](canvas.width, canvas.height);
    }
}; 

// Function to create and link shaders
graphics.createShaderProgram = function(v_src, f_src) {
    const vertexShader = graphics.loadShader(gl.VERTEX_SHADER, v_src);
    const fragmentShader = graphics.loadShader(gl.FRAGMENT_SHADER, f_src);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        logger.error("Unable to initialize the shader program: " + gl.getProgramInfoLog(shaderProgram));
        return null;
    }
    return shaderProgram;
}

// Function to create and compile a shader
graphics.loadShader = function(type, src) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        logger.error("An error occurred compiling shader: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// Function to clear the screen
graphics.clearBuffer = function() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

// Function to draw a line
graphics.drawLine = function(x1 = 0, y1 = 0, x2 = 0, y2 = 0, colour = error_colour) {
    
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y2
    ]), gl.DYNAMIC_DRAW);
    let positionLocation = gl.getAttribLocation(shader_program, "a_pos");
    gl.useProgram(shader_program);
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    // Set the colour
    let colourLocation = gl.getUniformLocation(shader_program, "u_colour");
    if (colour.length < 4) colour.push(1.0);
    gl.uniform4fv(colourLocation, colour);
    // Draw the actual rectangle
    gl.drawArrays(gl.LINES, 0, 2);

}

// Function to draw a rectangle
graphics.drawRect = function(x = 0, y = 0, w = 30, h = 30, colour = error_colour) {

    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Add rectangle data to the buffer
    graphics.setBufferRectangle(x, y, w, h);
    let positionLocation = gl.getAttribLocation(shader_program, "a_pos");
    gl.useProgram(shader_program);
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    // Set the colour
    let colourLocation = gl.getUniformLocation(shader_program, "u_colour");
    if (colour.length < 4) colour.push(1.0);
    gl.uniform4fv(colourLocation, colour);
    // Draw the actual rectangle
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

// Function to draw an image
graphics.drawImage = function (tex, x = 0, y = 0, w = 30, h = 30) {

    if (tex !== null && tex.loaded) {
        gl.bindTexture(gl.TEXTURE_2D, tex.texture);
        gl.useProgram(texture_shader);

        let positionLocation = gl.getAttribLocation(texture_shader, "a_pos");
        let texCoordLocation = gl.getAttribLocation(texture_shader, "a_tex");

        let positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        graphics.setBufferRectangle(x, y, w, h);
        let texcoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, full_rect, gl.DYNAMIC_DRAW);

        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(texCoordLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

        // Draw the actual rectangle
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    } else {
        graphics.drawRect(x, y, w, h, error_colour);
    }
}

// Function to draw an image
graphics.drawImageSource = function (tex, source = null, x = 0, y = 0, w = 30, h = 30) {

    if (tex !== null && tex.loaded) {
        gl.bindTexture(gl.TEXTURE_2D, tex.texture);
        gl.useProgram(texture_shader);

        let positionLocation = gl.getAttribLocation(texture_shader, "a_pos");
        let texCoordLocation = gl.getAttribLocation(texture_shader, "a_tex");

        let positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        graphics.setBufferRectangle(x, y, w, h);
        let texcoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        if (source === null) {
            gl.bufferData(gl.ARRAY_BUFFER, full_rect, gl.DYNAMIC_DRAW);
        } else {
            graphics.setBufferRectangle(
                source.target.x / source.w,
                source.target.y / source.h,
                source.target.w / source.w,
                source.target.h / source.h);
        }

        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(texCoordLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

        // Draw the actual rectangle
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    } else {
        graphics.drawRect(x, y, w, h, error_colour);
    }
}

// creates a texture info { width: w, height: h, texture: tex }
graphics.loadImage = function (path) {
    if (!!texture_cache[path]) {
        return texture_cache[path];
    }
    let tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);

    // let's assume all images are not a power of 2
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    let textureInfo = {
        width: 1,   // we don't know the size until it loads
        height: 1,
        loaded: false,
        texture: tex,
    };
    let image = new Image();
    image.src = path;
    image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, tex);
        textureInfo.width = image.width;
        textureInfo.height = image.height;

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        textureInfo.loaded = true;
    }
    image.onerror = function() {
        textureInfo.loaded = false;
    }

    texture_cache[path] = textureInfo;
    return textureInfo;
}

// Helper function to fill buffer data with rectangle data
graphics.setBufferRectangle = function(x, y, width, height) {

    let x1 = x;
    let x2 = x + width;
    let y1 = y;
    let y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2,
    ]), gl.DYNAMIC_DRAW);
}

graphics.width = function() {
    return gl.canvas.clientWidth;   
}

graphics.height = function() {
    return gl.canvas.clientHeight;
}