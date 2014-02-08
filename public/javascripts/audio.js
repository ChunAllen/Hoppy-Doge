$(function(){
    //Environment Variables
    var analyser,
        buf,
        currentPitch,
        noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
        doing = false;

    function hasGetUserMedia() {
        return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
                  navigator.mozGetUserMedia || navigator.msGetUserMedia)
    }

    if (hasGetUserMedia()) {
        //do some stuff here
        navigator.getMedia = ( navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia ||
                           navigator.msGetUserMedia);

        window.AudioContext = window.AudioContext ||
                              window.webkitAudioContext;

        var audioContext = new AudioContext();

    } else {
      alert('getUserMedia() is not supported in your browser');
    }
});
