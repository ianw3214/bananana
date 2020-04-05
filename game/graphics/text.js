"use strict";

// Separate shader from basic shaders in case different effects are needed for text
let text_shader;
const text_vertex = `
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
const text_fragment = `
    precision mediump float;
    uniform sampler2D u_image;
    uniform vec4 u_colour;
    varying vec2 v_texCoord;
    void main() {
        gl_FragColor = texture2D(u_image, v_texCoord) * u_colour;
    }`;

// TODO: Separate into JSON file
// The default font info
let defaultFont = {
    // ACTUAL TEXTURE DATA
    glyphTex: null,
    textBufferInfo: {},
    // FONT METADATA
    lowerCase: true,
    letterHeight: 8,
    spaceWidth: 8,
    spacing: -1,
    textureWidth: 64,
    textureHeight: 48,
    glyphInfos: {
        'a': { x: 0, y: 0, width: 8, },
        'b': { x: 8, y: 0, width: 8, },
        'c': { x: 16, y: 0, width: 8, },
        'd': { x: 24, y: 0, width: 8, },
        'e': { x: 32, y: 0, width: 8, },
        'f': { x: 40, y: 0, width: 8, },
        'g': { x: 48, y: 0, width: 8, },
        'h': { x: 56, y: 0, width: 8, },
        'i': { x: 0, y: 8, width: 8, },
        'j': { x: 8, y: 8, width: 8, },
        'k': { x: 16, y: 8, width: 8, },
        'l': { x: 24, y: 8, width: 8, },
        'm': { x: 32, y: 8, width: 8, },
        'n': { x: 40, y: 8, width: 8, },
        'o': { x: 48, y: 8, width: 8, },
        'p': { x: 56, y: 8, width: 8, },
        'q': { x: 0, y: 16, width: 8, },
        'r': { x: 8, y: 16, width: 8, },
        's': { x: 16, y: 16, width: 8, },
        't': { x: 24, y: 16, width: 8, },
        'u': { x: 32, y: 16, width: 8, },
        'v': { x: 40, y: 16, width: 8, },
        'w': { x: 48, y: 16, width: 8, },
        'x': { x: 56, y: 16, width: 8, },
        'y': { x: 0, y: 24, width: 8, },
        'z': { x: 8, y: 24, width: 8, },
        '0': { x: 16, y: 24, width: 8, },
        '1': { x: 24, y: 24, width: 8, },
        '2': { x: 32, y: 24, width: 8, },
        '3': { x: 40, y: 24, width: 8, },
        '4': { x: 48, y: 24, width: 8, },
        '5': { x: 56, y: 24, width: 8, },
        '6': { x: 0, y: 32, width: 8, },
        '7': { x: 8, y: 32, width: 8, },
        '8': { x: 16, y: 32, width: 8, },
        '9': { x: 24, y: 32, width: 8, },
        '-': { x: 32, y: 32, width: 8, },
        '*': { x: 40, y: 32, width: 8, },
        '!': { x: 48, y: 32, width: 8, },
        '?': { x: 56, y: 32, width: 8, },
        '.': { x: 0, y: 40, width: 8, },
    },
};

graphics.text = {
};

graphics.text.init = function () {
    // Initialize text shader
    text_shader = graphics.createShaderProgram(text_vertex, text_fragment);
    gl.useProgram(text_shader);
    gl.uniform1f(gl.getUniformLocation(text_shader, "u_screenWidth"), gl.canvas.clientWidth);
    gl.uniform1f(gl.getUniformLocation(text_shader, "u_screenHeight"), gl.canvas.clientHeight);

    // Create a texture.
    defaultFont.glyphTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, defaultFont.glyphTex);

    // Asynchronously load an image
    let image = new Image();
    image.src = "res/fonts/font.png";
    image.onload = function () {
        // Now that the image has loaded make copy it to the texture.
        gl.bindTexture(gl.TEXTURE_2D, defaultFont.glyphTex);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    };

    // Maunally create a bufferInfo
    defaultFont.textBufferInfo = {
        attribs: {
            a_position: { buffer: gl.createBuffer(), numComponents: 2, },
            a_texcoord: { buffer: gl.createBuffer(), numComponents: 2, },
        },
        numElements: 0,
    };
    // Add callback to resize uniforms when fullscreen changes
    graphics.addFullscreenCallback((w, h) => {
        // Also update shader uniforms
        gl.useProgram(text_shader);
        gl.uniform1f(gl.getUniformLocation(text_shader, "u_screenWidth"), w);
        gl.uniform1f(gl.getUniformLocation(text_shader, "u_screenHeight"), h);
    });
}

function makeVerticesForString(font, str, x, y, size) {
    let original_x = x;
    if (font.lowerCase == true) {
        str = str.toLowerCase();
    }
    let len = str.length;
    let numVertices = len * 6;
    let positions = new Float32Array(numVertices * 2);
    let texcoords = new Float32Array(numVertices * 2);
    let offset = 0;
    let maxX = font.textureWidth;
    let maxY = font.textureHeight;

    // Loop through each letter of the string
    for (let i = 0; i < len; ++i) {
        let letter = str[i];

        // Newline for \n
        if (letter === '\n') {
            x = original_x;
            y += size;
            offset += 12;
            continue;
        }

        // Only generate the glyph if info for it exists
        let glyphInfo = font.glyphInfos[letter];
        if (glyphInfo) {
            let x2 = x + glyphInfo.width * (size / font.letterHeight);
            let u1 = glyphInfo.x / maxX;
            let v1 = (glyphInfo.y + font.letterHeight - 1) / maxY;
            let u2 = (glyphInfo.x + glyphInfo.width - 1) / maxX;
            let v2 = glyphInfo.y / maxY;

            // 6 vertices per letter
            positions[offset + 0] = x;
            positions[offset + 1] = y + font.letterHeight * (size / font.letterHeight);
            texcoords[offset + 0] = u1;
            texcoords[offset + 1] = v1;

            positions[offset + 2] = x2;
            positions[offset + 3] = y + font.letterHeight * (size / font.letterHeight);
            texcoords[offset + 2] = u2;
            texcoords[offset + 3] = v1;

            positions[offset + 4] = x;
            positions[offset + 5] = y;
            texcoords[offset + 4] = u1;
            texcoords[offset + 5] = v2;

            positions[offset + 6] = x;
            positions[offset + 7] = y;
            texcoords[offset + 6] = u1;
            texcoords[offset + 7] = v2;

            positions[offset + 8] = x2;
            positions[offset + 9] = y + font.letterHeight * (size / font.letterHeight);
            texcoords[offset + 8] = u2;
            texcoords[offset + 9] = v1;

            positions[offset + 10] = x2;
            positions[offset + 11] = y;
            texcoords[offset + 10] = u2;
            texcoords[offset + 11] = v2;

            x += glyphInfo.width * (size / font.letterHeight) + font.spacing;
            offset += 12;
        } else {
            // we don't have this character so just advance
            x += font.spaceWidth;
        }
    }

    // return ArrayBufferViews for the portion of the TypedArrays
    // that were actually used.
    return {
        arrays: {
            position: new Float32Array(positions.buffer, 0, offset),
            texcoord: new Float32Array(texcoords.buffer, 0, offset),
        },
        numVertices: offset / 2,
    };
}

graphics.text.drawText = function (text, font = defaultFont, x = 0, y = 0, size = 16, colour = [1.0, 1.0, 1.0, 1.0]) 
{

    if (typeof text !== "string") {
        logger.error("Unable to draw text: " + text);
        return;
    }

    gl.useProgram(text_shader);
    gl.bindTexture(gl.TEXTURE_2D, font.glyphTex);

    let vertices = makeVerticesForString(font, text, x, y, size);

    let positionLocation = gl.getAttribLocation(text_shader, "a_pos");
    let texCoordLocation = gl.getAttribLocation(text_shader, "a_tex");

    // update the buffers
    font.textBufferInfo.attribs.a_position.numComponents = 2;
    gl.bindBuffer(gl.ARRAY_BUFFER, font.textBufferInfo.attribs.a_position.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices.arrays.position, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, font.textBufferInfo.attribs.a_texcoord.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices.arrays.texcoord, gl.DYNAMIC_DRAW);

    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, font.textBufferInfo.attribs.a_position.buffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, font.textBufferInfo.attribs.a_texcoord.buffer);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    let colourLocation = gl.getUniformLocation(text_shader, "u_colour");
    if (colour.length < 4) colour.push(1.0);
    gl.uniform4fv(colourLocation, colour);

    gl.drawArrays(gl.TRIANGLES, 0, vertices.numVertices);
}

graphics.text.characterSupported = function(character)
{
    for (var glyph in defaultFont.glyphInfos)
    {
        if (glyph == character)
        {
            return true;
        }
    }
    return false;
}