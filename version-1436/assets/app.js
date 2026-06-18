(function () {
  var toggle = document.querySelector('[data-mobile-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-hero-carousel]').forEach(function (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var prev = carousel.querySelector('[data-hero-prev]');
    var next = carousel.querySelector('[data-hero-next]');
    var index = 0;
    var timer;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function start() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
        start();
      });
    });

    show(0);
    start();
  });

  document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
    var input = scope.querySelector('[data-search-box]');
    var buttons = Array.prototype.slice.call(scope.querySelectorAll('[data-filter-button]'));
    var container = scope.parentElement;
    var activeFilter = 'all';

    function update() {
      var query = input ? input.value.trim().toLowerCase() : '';
      var cards = Array.prototype.slice.call(container.querySelectorAll('[data-card]'));

      cards.forEach(function (card) {
        var searchText = card.getAttribute('data-search') || '';
        var category = card.getAttribute('data-category') || '';
        var year = card.getAttribute('data-year') || '';
        var matchesText = !query || searchText.indexOf(query) !== -1 || year.indexOf(query) !== -1;
        var matchesFilter = activeFilter === 'all' || searchText.indexOf(activeFilter) !== -1 || category === activeFilter;
        card.classList.toggle('is-hidden', !(matchesText && matchesFilter));
      });
    }

    if (input) {
      input.addEventListener('input', update);
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        buttons.forEach(function (item) {
          item.classList.remove('is-active');
        });
        button.classList.add('is-active');
        activeFilter = button.getAttribute('data-filter-button') || 'all';
        update();
      });
    });
  });
})();
