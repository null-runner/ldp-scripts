document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM completamente caricato e analizzato");

    var phoneInput = document.querySelector('input[name="phone_number"]');
    var emailInput = document.querySelector('input[name="email"]');
    var errorMessage = document.createElement('div');

    errorMessage.style.color = 'white';
    errorMessage.style.backgroundColor = 'red';
    errorMessage.style.padding = '10px';
    errorMessage.style.marginTop = '10px';
    errorMessage.style.fontSize = '16px';
    errorMessage.style.textAlign = 'center';
    errorMessage.style.display = 'none';

    var targetElement = document.querySelector('.elHeadlineWrapper.id-6Z-xvxaqM-92');
    if (targetElement) {
        targetElement.parentNode.insertBefore(errorMessage, targetElement.nextSibling);
        console.log("Messaggio di errore posizionato correttamente");
    }

    var iti;
    if (phoneInput) {
        iti = window.intlTelInput(phoneInput, {
            initialCountry: 'it',
            autoPlaceholder: 'polite',
            utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.16/js/utils.js'
        });

        phoneInput.value = '+39 ';
        setTimeout(function() {
            phoneInput.value = '';
        }, 100);
    }

    function validateInputs() {
        var phoneValid = phoneInput ? iti.isValidNumber() : true;
        var emailValid = validateEmail(emailInput.value);

        console.log("Phone valid:", phoneValid);
        console.log("Email valid:", emailValid);

        if (!phoneValid && !emailValid) {
            return 'Assicurati di inserire email e telefono corretti, o non potrai procedere.';
        } else if (!phoneValid) {
            return 'Assicurati di inserire un numero di telefono corretto, o non potrai procedere.';
        } else if (!emailValid) {
            return 'Assicurati di inserire un\'email corretta, o non potrai procedere.';
        } else {
            return '';
        }
    }

    function validateEmail(email) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function getUTMParameters() {
        var params = {};
        window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) {
            if (key.startsWith('utm_')) {
                params[key] = decodeURIComponent(value);
            }
        });
        console.log("Parametri UTM ottenuti:", params);
        return params;
    }

    function updateUrlWithUTM(url, utmParams) {
        try {
            var newUrl = new URL(url, window.location.origin);
            var existingParams = new URLSearchParams(newUrl.search);

            for (var key in utmParams) {
                existingParams.set(key, utmParams[key]);
            }

            newUrl.search = existingParams.toString();
            console.log("URL aggiornato con parametri UTM:", newUrl.toString());
            return newUrl.toString();
        } catch (e) {
            console.error("Errore in updateUrlWithUTM:", e.message);
            return url;
        }
    }

    function handleButtonClick(event) {
        var utmParams = getUTMParameters();
        var button = event.target.closest('a');
        if (button) {
            var redirectTo = button.getAttribute('data-on-submit-go-to');
            if (redirectTo) {
                event.preventDefault();
                var updatedUrl = updateUrlWithUTM(redirectTo, utmParams);
                window.location.href = updatedUrl;
            }
        }
    }

    function attachButtonListener() {
        var buttons = document.querySelectorAll('.elButton');
        buttons.forEach(function(button) {
            button.addEventListener('click', handleButtonClick);
        });
        console.log('Button listener attached');
    }

    function updateLinks(utmParams) {
        var links = document.querySelectorAll('a');
        links.forEach(function(link) {
            var currentHref = link.getAttribute('href');
            if (currentHref && !currentHref.startsWith('#') && !currentHref.startsWith('mailto:')) {
                var updatedUrl = updateUrlWithUTM(currentHref, utmParams);
                link.setAttribute('href', updatedUrl);
                console.log("Link aggiornato:", link.getAttribute('href'));
            }
        });
    }

    var utmParams = getUTMParameters();
    console.log("Parametri UTM:", utmParams);

    // Aggiorna i link con i parametri UTM
    updateLinks(utmParams);

    // Attacca l'ascoltatore di click ai bottoni
    attachButtonListener();
});
