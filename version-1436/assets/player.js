(function () {
  function attachStream(container) {
    var video = container.querySelector('video');
    var stream = video ? video.getAttribute('data-stream') : '';

    if (!video || !stream) {
      return;
    }

    if (container.getAttribute('data-loaded') === '1') {
      video.play().catch(function () {});
      return;
    }

    container.setAttribute('data-loaded', '1');
    container.classList.add('is-playing');

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({ enableWorker: true });
      hls.loadSource(stream);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play().catch(function () {});
      });
      hls.on(window.Hls.Events.ERROR, function (_, data) {
        if (!data || !data.fatal) {
          return;
        }
        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
        } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
        } else {
          hls.destroy();
        }
      });
    } else {
      video.src = stream;
      video.addEventListener('loadedmetadata', function () {
        video.play().catch(function () {});
      }, { once: true });
      video.load();
    }
  }

  document.querySelectorAll('.player-card').forEach(function (container) {
    var overlay = container.querySelector('.player-overlay');
    var video = container.querySelector('video');

    if (overlay) {
      overlay.addEventListener('click', function () {
        attachStream(container);
      });
    }

    if (video) {
      video.addEventListener('click', function () {
        if (container.getAttribute('data-loaded') !== '1') {
          attachStream(container);
        }
      });
    }
  });
})();
