document.addEventListener('DOMContentLoaded', function() {
    // Funzione per ottenere i parametri UTM dall'URL
    function getUTMParameters() {
        var params = {};
        window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) {
            if (key.startsWith('utm_')) {
                params[key] = decodeURIComponent(value);
            }
        });
        return params;
    }

    // Funzione per memorizzare i parametri UTM nel localStorage
    function storeUTMInLocalStorage(utmParams) {
        localStorage.setItem('utmParams', JSON.stringify(utmParams));
    }

    // Funzione per ottenere i parametri UTM dal localStorage
    function getUTMFromLocalStorage() {
        var storedParams = localStorage.getItem('utmParams');
        return storedParams ? JSON.parse(storedParams) : {};
    }

    // Funzione per gestire i redirect e aggiungere i parametri UTM ai link e form
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

    // Funzione per validare gli input e mostrare un messaggio di errore se necessario
    function validateInputs() {
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
        }

        function validateEmail(email) {
            var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(String(email).toLowerCase());
        }

        function validatePhone(phone) {
            var re = /^(\+39|0039)?\s?3\d{2}[\s.-]?\d{6,7}$/;
            return re.test(String(phone).replace(/\s+/g, ''));
        }

        var phoneValid = phoneInput ? validatePhone(phoneInput.value) : true;
        var emailValid = emailInput ? validateEmail(emailInput.value) : true;

        if (!phoneValid && !emailValid) {
            errorMessage.textContent = 'Assicurati di inserire email e telefono corretti, o non potrai procedere.';
            errorMessage.style.display = 'block';
            return false;
        } else if (!phoneValid) {
            errorMessage.textContent = 'Assicurati di inserire un numero di telefono corretto, o non potrai procedere.';
            errorMessage.style.display = 'block';
            return false;
        } else if (!emailValid) {
            errorMessage.textContent = 'Assicurati di inserire un\'email corretta, o non potrai procedere.';
            errorMessage.style.display = 'block';
            return false;
        } else {
            errorMessage.style.display = 'none';
            return true;
        }
    }

    // Funzione per gestire l'invio del form
    function handleFormSubmission(event) {
        event.preventDefault();
        if (validateInputs()) {
            var form = event.target.closest('form');
            if (form) {
                var utmParams = getUTMFromLocalStorage();
                // Aggiungi i parametri UTM come campi nascosti al form
                Object.keys(utmParams).forEach(key => {
                    var input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = utmParams[key];
                    form.appendChild(input);
                });
                form.submit();
            }
        }
    }

    // Funzione per attaccare il listener al pulsante di invio del form
    function attachFormListener() {
        var submitButton = document.querySelector('#modalPopup .elBTN .elButton');
        if (submitButton) {
            submitButton.addEventListener('click', handleFormSubmission);
        } else {
            setTimeout(attachFormListener, 100);
        }
    }

    // Salva i parametri UTM nel localStorage
    var utmParams = getUTMParameters();
    storeUTMInLocalStorage(utmParams);

    // Gestisci i redirect
    handleRedirect();

    // Osserva l'apertura del popup e attacca il listener del form
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                var popup = document.getElementById('modalPopup');
                if (popup && window.getComputedStyle(popup).display !== 'none') {
                    attachFormListener();
                    observer.disconnect();
                }
            }
        });
    });

    var popup = document.getElementById('modalPopup');
    if (popup) {
        observer.observe(popup, { attributes: true });
    }
});
