(function() {
    var CDN = 'https://raintoto-hujan.b-cdn.net/raintoto/bank/';

    var knownBanks = [
        'bca', 'bni', 'bsi', 'mandiri', 'cimb', 'danamon', 'dana',
        'gopay', 'jago', 'jenius', 'linkaja', 'maybank', 'mega',
        'ovo', 'panin', 'permata', 'qris', 'seabank', 'sinarmas'
    ];

    var lastRun = 0;

    function injectStyle() {
        if (document.getElementById('banklist-override-css')) return;
        var style = document.createElement('style');
        style.id = 'banklist-override-css';
        style.textContent = `
            .banklist__wrapper { margin-top: 0 !important; padding-top: 0 !important; }
            .banklist__wrapper .carousel__track { gap: 6px !important; }
            .banklist__wrapper .carousel__slide { padding: 0 !important; }
            .banklist__item { background: transparent !important; background-color: transparent !important; box-shadow: none !important; border: none !important; padding: 2px !important; }
            .banklist__logo { background: transparent !important; width: 100% !important; height: 70px !important; object-fit: contain !important; }
            .banklist__status-indicator { display: none !important; }
            .banklist__status-legend { margin-top: 4px !important; }
        `;
        document.head.appendChild(style);
    }

    function getSlug(src) {
        var m = src.match(/\/raintoto\/bank\/([^.]+)\./);
        if (m) return m[1].toLowerCase();
        m = src.match(/\/banks\/([^.]+)\./);
        return m ? m[1].toLowerCase() : '';
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
        var slides = wrapper.querySelectorAll('.carousel__slide');
        if (!slides.length) return;

        injectStyle();

        var carousel = wrapper.querySelector('.banklist__carousel');
        if (carousel) carousel.style.setProperty('--vc-slide-gap', '6px');

        var seen = {};

        slides.forEach(function(slide) {
            var img = slide.querySelector('.banklist__logo');
            if (!img) { hide(slide); return; }

            var slug = getSlug(img.getAttribute('src') || '');
            if (!slug || knownBanks.indexOf(slug) === -1) { hide(slide); return; }

            var indicator = slide.querySelector('.banklist__status-indicator');
            if (indicator && (
                indicator.classList.contains('banklist__status-indicator--offline') ||
                indicator.classList.contains('banklist__status-indicator--warning')
            )) { hide(slide); return; }

            if (seen[slug]) { hide(slide); return; }
            seen[slug] = true;

            slide.style.removeProperty('display');
            if (img.src.indexOf('raintoto-hujan.b-cdn.net') === -1) {
                var newSrc = CDN + slug + '.webp';
                img.src = newSrc;
                img.srcset = newSrc + ' 1x, ' + newSrc + ' 2x';
            }
        });
    }

    var obs = new MutationObserver(run);
    obs.observe(document.documentElement, { childList: true, subtree: true });

    setTimeout(run, 1000);
    setTimeout(run, 2500);
    setTimeout(run, 4500);
})();