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

    function validateInputs() {
        var phoneValid = phoneInput ? validatePhone(phoneInput.value) : true;
        var emailValid = emailInput ? validateEmail(emailInput.value) : true;

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

    function validatePhone(phone) {
        // Semplice validazione per numeri italiani
        var re = /^(\+39|0039)?\s?3\d{2}[\s.-]?\d{6,7}$/;
        return re.test(String(phone).replace(/\s+/g, ''));
    }

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

    function updateUTMInLinks() {
        var utmParams = getUTMFromLocalStorage();

        if (Object.keys(utmParams).length > 0) {
            var button = document.querySelector('a.elButton');
            if (button) {
                var buttonHref = button.getAttribute('href');
                var buttonDataOnSubmitGoTo = button.getAttribute('data-on-submit-go-to');

                // Aggiorna href
                if (buttonHref && !buttonHref.startsWith('#')) {
                    var newButtonHref = new URL(buttonHref, window.location.origin);
                    Object.keys(utmParams).forEach(key => newButtonHref.searchParams.set(key, utmParams[key]));
                    button.setAttribute('href', newButtonHref.toString());
                }

                // Aggiorna data-on-submit-go-to
                if (buttonDataOnSubmitGoTo) {
                    var newDataOnSubmitGoTo = new URL(buttonDataOnSubmitGoTo, window.location.origin);
                    Object.keys(utmParams).forEach(key => newDataOnSubmitGoTo.searchParams.set(key, utmParams[key]));
                    button.setAttribute('data-on-submit-go-to', newDataOnSubmitGoTo.toString());
                }
            }
        }
    }

    function handleFormSubmission(event) {
        event.preventDefault();
        var validationMessage = validateInputs();
        if (validationMessage) {
            console.log("Validazione fallita: " + validationMessage);
            errorMessage.textContent = validationMessage;
            errorMessage.style.display = 'block';
            return;
        }

        errorMessage.style.display = 'none';
        console.log('Form valido, procedi con l\'invio');
        
        var button = document.querySelector('a.elButton');
        if (button) {
            updateUTMInLinks();
            var redirectUrl = button.getAttribute('data-on-submit-go-to');
            if (redirectUrl) {
                window.location.href = redirectUrl;
            } else {
                console.log("URL di reindirizzamento non trovato.");
            }
        }
    }

    function attachFormListener() {
        var submitButton = document.querySelector('a.elButton');
        if (submitButton) {
            submitButton.addEventListener('click', handleFormSubmission);
            console.log('Form listener attached');
        } else {
            setTimeout(attachFormListener, 100);
        }
    }

    // Salva i parametri UTM nel localStorage
    var utmParams = getUTMParameters();
    storeUTMInLocalStorage(utmParams);
    console.log('UTM params stored in localStorage:', utmParams);

    // Osserva l'apertura del popup
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

    // Visualizza messaggio di input iniziale
    errorMessage.textContent = 'Assicurati di inserire email e/o telefono corretti.';
    errorMessage.style.display = 'block';
});
