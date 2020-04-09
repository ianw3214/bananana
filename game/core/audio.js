"use strict";

let audio = {
    // The track is the current playing music, there should always only be 1
    track: null
}

audio.playSound = function (file_path, volume = 1.0) {
    let sound = document.createElement("audio");
    sound.src = file_path;
    sound.volume = volume
    sound.setAttribute("preload", "auto");
    sound.setAttribute("controls", "none");
    sound.style.display = "none";
    document.body.appendChild(sound);
    sound.onended = function () {
        // Something here
    }
    sound.play();
}

audio.playTrack = function (track_path) {
    // TODO: Eventually use a fadeout
    if (audio.track !== null) audio.track.pause();
    audio.track = document.createElement("audio");
    audio.track.src = track_path;
    audio.track.volume = 0.1;
    audio.track.setAttribute("preload", "auto");
    audio.track.setAttribute("controls", "none");
    audio.track.style.display = "none";
    document.body.appendChild(audio.track);
    audio.track.onended = function () {
        // Something here
    }
    audio.track.play();
}