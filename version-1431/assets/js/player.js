(function() {
    var players = Array.prototype.slice.call(document.querySelectorAll('[data-stream]'));
    players.forEach(function(player) {
        var video = player.querySelector('video');
        var poster = player.querySelector('.player-poster');
        var button = player.querySelector('.play-button');
        var stream = player.getAttribute('data-stream');
        var initialized = false;
        var hls = null;

        function initPlayer() {
            if (initialized || !video || !stream) {
                return;
            }
            initialized = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
            } else {
                video.src = stream;
            }
        }

        function playVideo() {
            initPlayer();
            if (poster) {
                poster.classList.add('is-hidden');
            }
            if (video) {
                video.controls = true;
                var playResult = video.play();
                if (playResult && typeof playResult.catch === 'function') {
                    playResult.catch(function() {});
                }
            }
        }

        if (button) {
            button.addEventListener('click', playVideo);
        }
        if (poster) {
            poster.addEventListener('click', playVideo);
        }
        if (video) {
            video.addEventListener('click', function() {
                if (!initialized) {
                    playVideo();
                }
            });
        }

        window.addEventListener('pagehide', function() {
            if (hls && typeof hls.destroy === 'function') {
                hls.destroy();
                hls = null;
            }
        });
    });
})();
