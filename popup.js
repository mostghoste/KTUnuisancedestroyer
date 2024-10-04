// When the popup loads, retrieve and display stored settings and statistics
document.addEventListener('DOMContentLoaded', () => {
    const secretInput = document.getElementById('secret');
    const showSecretCheckbox = document.getElementById('show-secret');
    const autoLoginCheckbox = document.getElementById('auto-login');
    const autoConsentCheckbox = document.getElementById('auto-consent');
    const message = document.getElementById('message');
    const totpCountElement = document.getElementById('totp-count');
    const consentCountElement = document.getElementById('consent-count');

    // Retrieve and autofill the saved settings
    browser.storage.local.get(['sharedSecret', 'autoLogin', 'autoConsent', 'totpCount', 'consentCount']).then((data) => {
        if (data.sharedSecret) {
            secretInput.value = data.sharedSecret;
        }
        if (data.autoLogin) {
            autoLoginCheckbox.checked = data.autoLogin;
        }
        if (data.autoConsent) {
            autoConsentCheckbox.checked = data.autoConsent;
        }
        // Display the statistics
        totpCountElement.textContent = data.totpCount || 0;
        consentCountElement.textContent = data.consentCount || 0;
    }).catch((error) => {
        console.error('Error retrieving settings:', error);
    });

    // Show/hide the secret
    showSecretCheckbox.addEventListener('change', () => {
        secretInput.type = showSecretCheckbox.checked ? 'text' : 'password';
    });

    // Save the secret whenever it changes
    secretInput.addEventListener('input', () => {
        const secret = secretInput.value;
        saveSettings({ sharedSecret: secret });
    });

    // Save the auto-login setting whenever it changes
    autoLoginCheckbox.addEventListener('change', () => {
        const autoLogin = autoLoginCheckbox.checked;
        saveSettings({ autoLogin: autoLogin });
    });

    // Save the auto-consent setting whenever it changes
    autoConsentCheckbox.addEventListener('change', () => {
        const autoConsent = autoConsentCheckbox.checked;
        saveSettings({ autoConsent: autoConsent });
    });
});

// Function to save settings and display a message
function saveSettings(settings) {
    browser.storage.local.set(settings)
        .then(() => {
            console.log("Settings saved to storage:", settings);

            // Display a success message
            const message = document.getElementById('message');
            message.textContent = 'Settings saved!';
            message.style.display = 'block';
            message.style.color = 'lightgreen';

            // Hide the message after a short delay
            setTimeout(() => {
                message.style.display = 'none';
            }, 2000);
        })
        .catch((error) => {
            console.error("Error saving settings:", error);
            const message = document.getElementById('message');
            message.textContent = 'Failed to save settings.';
            message.style.color = 'red';
            message.style.display = 'block';
        });
}
