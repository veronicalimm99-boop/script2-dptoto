(function() {
    var CDN = 'https://imgstorage.site/view/yuyu/';

    var knownBanks = [
        'bca', 'bni', 'mandiri', 'bri', 'dana', 'qris'
    ];

    var lastRun = 0;

    function injectStyle() {
        if (document.getElementById('banklist-override-css')) return;

        var style = document.createElement('style');
        style.id = 'banklist-override-css';
        style.textContent = `
            .banklist__wrapper { 
                margin-top: 0 !important; 
                padding-top: 0 !important; 
            }

            .banklist__wrapper .carousel__track { 
                gap: 6px !important; 
                transform: translateX(0px) !important;
                transition: none !important;
            }

            .banklist__wrapper .carousel__slide { 
                padding: 0 !important; 
            }

            .banklist__item { 
                background: transparent !important; 
                background-color: transparent !important; 
                box-shadow: none !important; 
                border: none !important; 
                padding: 2px !important; 
            }

            .banklist__logo { 
                background: transparent !important; 
                width: 100% !important; 
                height: 70px !important; 
                object-fit: contain !important; 
            }

            .banklist__status-indicator { 
                display: none !important; 
            }

            .banklist__status-legend { 
                margin-top: 4px !important; 
            }

            .banklist__wrapper .carousel__pagination {
                display: none !important;
            }
        `;

        document.head.appendChild(style);
    }

    function getSlug(src) {
        var m = src.match(/\/raintoto\/bank\/([^.]+)\./);
        if (m) return m[1].toLowerCase();

        m = src.match(/\/banks\/([^.]+)\./);
        if (m) return m[1].toLowerCase();

        m = src.match(/\/view\/yuyu\/([^.]+)\./);
        if (m) return m[1].toLowerCase();

        return '';
    }

    function hide(slide) {
        slide.style.setProperty('display', 'none', 'important');
    }

    function stopCarousel(wrapper) {
        var track = wrapper.querySelector('.carousel__track');
        var viewport = wrapper.querySelector('.carousel__viewport');
        var carousel = wrapper.querySelector('.banklist__carousel');

        if (track) {
            track.style.setProperty('transform', 'translateX(0px)', 'important');
            track.style.setProperty('transition', 'none', 'important');
        }

        if (viewport) {
            viewport.style.setProperty('overflow', 'hidden', 'important');
        }

        if (carousel) {
            carousel.style.setProperty('--vc-slide-gap', '6px');
            carousel.removeAttribute('tabindex');
        }
    }

    function run() {
        var now = Date.now();
        if (now - lastRun < 400) return;
        lastRun = now;

        var wrapper = document.querySelector('.banklist__wrapper');
        if (!wrapper) return;

        var slides = wrapper.querySelectorAll('.carousel__slide');
        if (!slides.length) return;

        injectStyle();

        var seen = {};
        var activeCount = 0;

        slides.forEach(function(slide) {
            var img = slide.querySelector('.banklist__logo');

            if (!img) {
                hide(slide);
                return;
            }

            var slug = getSlug(img.getAttribute('src') || '');

            if (!slug || knownBanks.indexOf(slug) === -1) {
                hide(slide);
                return;
            }

            var indicator = slide.querySelector('.banklist__status-indicator');

            if (indicator && (
                indicator.classList.contains('banklist__status-indicator--offline') ||
                indicator.classList.contains('banklist__status-indicator--warning')
            )) {
                hide(slide);
                return;
            }

            if (seen[slug]) {
                hide(slide);
                return;
            }

            seen[slug] = true;
            activeCount++;

            slide.style.removeProperty('display');

            var newSrc = CDN + slug + '.webp';

            if (img.src !== newSrc) {
                img.src = newSrc;
                img.srcset = newSrc + ' 1x, ' + newSrc + ' 2x';
            }
        });

        stopCarousel(wrapper);
    }

    var obs = new MutationObserver(run);
    obs.observe(document.documentElement, { childList: true, subtree: true, attributes: true });

    setTimeout(run, 1000);
    setTimeout(run, 2500);
    setTimeout(run, 4500);
    setInterval(run, 1500);
})();
