// When the popup loads, retrieve and display stored settings
document.addEventListener('DOMContentLoaded', () => {
    const secretInput = document.getElementById('secret');
    const showSecretCheckbox = document.getElementById('show-secret');
    const autoLoginCheckbox = document.getElementById('auto-login');
    const message = document.getElementById('message');

    // Retrieve and autofill the saved settings
    browser.storage.local.get(['sharedSecret', 'autoLogin']).then((data) => {
        if (data.sharedSecret) {
            secretInput.value = data.sharedSecret;
        }
        if (data.autoLogin) {
            autoLoginCheckbox.checked = data.autoLogin;
        }
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
