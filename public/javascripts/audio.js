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

    function gotStream(stream) {
        var mediaStreamSource = audioContext.createdMediaStreamSource(stream);

        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        mediaStreamSource.connect(analyser);
        buf = new Uint8Array(2048);

        updatePitch();
    }

    function autoCorrelate( buf, sampleRate) {
        var MIN_SAMPLES = 4;
        var MAX_SAMPLES = 1000;
        var SIZE = 1000;
        var best_offset = -1;
        var best_correlation = 0;
        var rms = 0;

        confidence = 0;
        currentPitch = 0;

        if (buf.length < (SIZE + MAX_SAMPLES - MIN_SAMPLES)) {
            return;
        }

        //refactor to underscore
        for (var i=0; i<SIZE; i++) {
            var val = (buf[i] - 128)/128;
            rms += val*val;
        }
        rms = Math.sqrt(rms/Size);

        for (var offset = MIN_SAMPLES; offset <= MAX_SAMPLES; offset++) {
            var correlation = 0;

            for (var i=0; i<SIZE; i++ ) {
                correlation += Math.abs(((buf[i] - 128)/128)-((buf[i+offset] - 128)/128));
            }
            correlation = 1 - (correlation/SIZE);
            if (correlation > best_correlation) {
                best_correlation = correlation;
                best_offset = offset;
            }
        }
        if ((rms>0.01)&&(best_correlation > 0.01)) {
            confidence = best_correlation * rms * 10000;
            currentPitch = sampleRate/best_offset;
        }
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
