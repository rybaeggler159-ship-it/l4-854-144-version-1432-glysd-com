(function() {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');
    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function() {
            mobileNav.classList.toggle('open');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
        var current = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function(slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });
            dots.forEach(function(dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }

        function startTimer() {
            stopTimer();
            timer = window.setInterval(function() {
                showSlide(current + 1);
            }, 4800);
        }

        function stopTimer() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function(dot, index) {
            dot.addEventListener('click', function() {
                showSlide(index);
                startTimer();
            });
        });

        hero.addEventListener('mouseenter', stopTimer);
        hero.addEventListener('mouseleave', startTimer);
        showSlide(0);
        startTimer();
    }

    var heroSearch = document.querySelector('[data-hero-search]');
    if (heroSearch) {
        heroSearch.addEventListener('submit', function(event) {
            event.preventDefault();
            var input = heroSearch.querySelector('input');
            var query = input ? input.value.trim() : '';
            var target = 'search.html';
            if (query) {
                target += '?q=' + encodeURIComponent(query);
            }
            window.location.href = target;
        });
    }

    var filterForm = document.querySelector('[data-filter-form]');
    if (filterForm) {
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
        var input = filterForm.querySelector('[data-filter-input]');
        var category = filterForm.querySelector('[data-filter-category]');
        var year = filterForm.querySelector('[data-filter-year]');
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get('q') || '';
        var initialCategory = params.get('category') || '';

        if (input && initialQuery) {
            input.value = initialQuery;
        }
        if (category && initialCategory) {
            category.value = initialCategory;
        }

        function applyFilters() {
            var query = input ? input.value.trim().toLowerCase() : '';
            var selectedCategory = category ? category.value : '';
            var selectedYear = year ? year.value : '';
            cards.forEach(function(card) {
                var haystack = card.getAttribute('data-search') || '';
                var cardCategory = card.getAttribute('data-category') || '';
                var cardYear = card.getAttribute('data-year') || '';
                var matchQuery = !query || haystack.indexOf(query) !== -1;
                var matchCategory = !selectedCategory || cardCategory === selectedCategory;
                var matchYear = !selectedYear || cardYear === selectedYear;
                card.classList.toggle('hidden-card', !(matchQuery && matchCategory && matchYear));
            });
        }

        filterForm.addEventListener('submit', function(event) {
            event.preventDefault();
            applyFilters();
        });
        ['input', 'change'].forEach(function(type) {
            filterForm.addEventListener(type, applyFilters);
        });
        applyFilters();
    }
})();
