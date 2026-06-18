function createPlayer(id, streamUrl) {
  var frame = document.getElementById(id);

  if (!frame) {
    return;
  }

  var video = frame.querySelector("video");
  var cover = frame.querySelector(".play-cover");
  var started = false;
  var hls = null;

  function attach() {
    if (started) {
      return;
    }

    started = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
    } else {
      video.src = streamUrl;
    }
  }

  function play() {
    attach();

    if (cover) {
      cover.classList.add("is-hidden");
    }

    var result = video.play();

    if (result && typeof result.catch === "function") {
      result.catch(function () {});
    }
  }

  if (cover) {
    cover.addEventListener("click", play);
  }

  video.addEventListener("click", function () {
    if (!started) {
      play();
    }
  });

  video.addEventListener("play", function () {
    if (!started) {
      attach();
    }

    if (cover) {
      cover.classList.add("is-hidden");
    }
  });

  frame.addEventListener("remove", function () {
    if (hls) {
      hls.destroy();
    }
  });
}
