console.log("Consent script loaded.");

// Function to handle auto-consent
function handleConsentPage() {
    console.log("Consent page detected. Attempting to retrieve auto-consent setting...");

    // Retrieve auto-consent setting from storage
    browser.storage.local.get('autoConsent')
        .then((data) => {
            if (data.autoConsent) {
                console.log("Auto-consent is enabled. Attempting to press the consent button...");

                const consentButton = document.querySelector('#yesbutton');
                if (consentButton) {
                    setTimeout(() => {
                        consentButton.click();
                        console.log("Consent button clicked.");

                        // Increment the consent skip counter
                        incrementCounter('consentCount');
                    }, 500); // 500 milliseconds delay
                } else {
                    console.error("Consent button not found. Check the selector.");
                }
            } else {
                console.log("Auto-consent is disabled.");
            }
        })
        .catch((error) => {
            console.error("Error retrieving auto-consent setting:", error);
        });
}

// Function to increment a counter in storage
function incrementCounter(counterKey) {
    browser.storage.local.get(counterKey).then((data) => {
        let count = data[counterKey] || 0;
        count++;
        let update = {};
        update[counterKey] = count;
        browser.storage.local.set(update);
    });
}

// Check if the document is already loaded
if (document.readyState === 'complete') {
    handleConsentPage();
} else {
    window.addEventListener('load', handleConsentPage);
}
