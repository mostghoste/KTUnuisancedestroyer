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
});

// Save the settings when the save button is clicked
document.getElementById('save').addEventListener('click', () => {
    const secret = document.getElementById('secret').value;
    const autoLogin = document.getElementById('auto-login').checked;
    const message = document.getElementById('message');

    console.log("Save button clicked. Secret entered:", secret);

    if (secret) {
        // Send the settings to be saved in storage
        browser.storage.local.set({ sharedSecret: secret, autoLogin: autoLogin })
            .then(() => {
                console.log("Settings saved to storage.");

                // Display a success message
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
                message.textContent = 'Failed to save settings.';
                message.style.color = 'red';
                message.style.display = 'block';
            });
    } else {
        console.error("No secret entered.");
        message.textContent = 'Please enter a secret.';
        message.style.color = 'red';
        message.style.display = 'block';
    }
});
