document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".mobile-toggle");
  var menu = document.querySelector(".mobile-menu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  document.querySelectorAll("[data-carousel]").forEach(function (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-slide-dot]"));
    var prev = carousel.querySelector("[data-slide-prev]");
    var next = carousel.querySelector("[data-slide-next]");
    var current = 0;
    var timer = null;

    function setSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        setSlide(current + 1);
      }, 5000);
    }

    if (slides.length > 1) {
      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          setSlide(index);
          restart();
        });
      });

      if (prev) {
        prev.addEventListener("click", function () {
          setSlide(current - 1);
          restart();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          setSlide(current + 1);
          restart();
        });
      }

      restart();
    }
  });

  document.querySelectorAll("[data-filter-input]").forEach(function (input) {
    var list = document.querySelector(input.getAttribute("data-filter-input"));
    var cards = list ? Array.prototype.slice.call(list.querySelectorAll("[data-card]")) : [];

    function runFilter() {
      var value = input.value.trim().toLowerCase();

      cards.forEach(function (card) {
        var text = (card.getAttribute("data-search") || "").toLowerCase();
        card.classList.toggle("is-filter-hidden", value && text.indexOf(value) === -1);
      });
    }

    input.addEventListener("input", runFilter);
  });
});
