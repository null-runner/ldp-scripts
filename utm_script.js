document.addEventListener('DOMContentLoaded', function() {
    function getUTMParameters() {
        var params = {};
        window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) {
            if (key.startsWith('utm_')) {
                params[key] = decodeURIComponent(value);
            }
        });
        return params;
    }

    function storeUTMInLocalStorage(utmParams) {
        localStorage.setItem('utmParams', JSON.stringify(utmParams));
    }

    function getUTMFromLocalStorage() {
        var storedParams = localStorage.getItem('utmParams');
        return storedParams ? JSON.parse(storedParams) : {};
    }

    function handleRedirect() {
        var utmParams = getUTMFromLocalStorage();
        if (Object.keys(utmParams).length > 0) {
            var redirectLinks = document.querySelectorAll('a[href], form[action]');
            redirectLinks.forEach(link => {
                var href = link.getAttribute('href') || link.getAttribute('action');
                if (href) {
                    var newHref = new URL(href, window.location.origin);
                    Object.keys(utmParams).forEach(key => newHref.searchParams.set(key, utmParams[key]));
                    if (link.tagName === 'A') {
                        link.setAttribute('href', newHref.toString());
                    } else if (link.tagName === 'FORM') {
                        link.setAttribute('action', newHref.toString());
                    }
                }
            });
        }
    }

    var utmParams = getUTMParameters();
    storeUTMInLocalStorage(utmParams);

    handleRedirect();
});
