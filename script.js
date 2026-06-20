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
                overflow: hidden !important;
            }

            .banklist__wrapper .carousel__viewport {
                overflow: hidden !important;
            }

            .banklist__wrapper .carousel__track {
                display: flex !important;
                flex-wrap: nowrap !important;
                justify-content: center !important;
                align-items: center !important;
                gap: 6px !important;
                width: 100% !important;
                max-width: 100% !important;
                transform: translateX(0px) !important;
                transition: none !important;
                animation: none !important;
            }

            .banklist__wrapper .carousel__slide {
                padding: 0 !important;
                flex: 0 0 135px !important;
                width: 135px !important;
                max-width: 135px !important;
                display: flex !important;
            }

            .banklist__item { 
                background: transparent !important; 
                background-color: transparent !important; 
                box-shadow: none !important; 
                border: none !important; 
                padding: 2px !important; 
                width: 100% !important;
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

    function getSlug(src, img) {
        if (img && img.dataset.bankSlug) return img.dataset.bankSlug;

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

    function run() {
        var now = Date.now();
        if (now - lastRun < 400) return;
        lastRun = now;

        var wrapper = document.querySelector('.banklist__wrapper');
        if (!wrapper) return;

        var track = wrapper.querySelector('.carousel__track');
        if (!track) return;

        var slides = track.querySelectorAll('.carousel__slide');
        if (!slides.length) return;

        injectStyle();

        track.querySelectorAll('.banklist-clone').forEach(function(clone) {
            clone.remove();
        });

        var seen = {};

        slides.forEach(function(slide) {
            var img = slide.querySelector('.banklist__logo');

            if (!img) {
                hide(slide);
                return;
            }

            var slug = getSlug(img.getAttribute('src') || '', img);

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
            slide.style.removeProperty('display');

            img.dataset.bankSlug = slug;

            var newSrc = CDN + slug + '.webp';

            if (img.dataset.replaced !== '1') {
                img.src = newSrc;
                img.srcset = newSrc + ' 1x, ' + newSrc + ' 2x';
                img.dataset.replaced = '1';
            }
        });

        track.style.setProperty('transform', 'translateX(0px)', 'important');
        track.style.setProperty('animation', 'none', 'important');
        track.style.setProperty('width', '100%', 'important');

        var carousel = wrapper.querySelector('.banklist__carousel');
        if (carousel) carousel.style.setProperty('--vc-slide-gap', '6px');
    }

    var obs = new MutationObserver(run);
    obs.observe(document.documentElement, { childList: true, subtree: true });

    setTimeout(run, 1000);
    setTimeout(run, 2500);
    setTimeout(run, 4500);
})();
