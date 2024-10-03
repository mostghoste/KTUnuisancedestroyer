document.getElementById('save').addEventListener('click', () => {
    const secret = document.getElementById('secret').value;
    const message = document.getElementById('message');

    console.log("Save button clicked. Secret entered:", secret);

    if (secret) {
        // Send the shared secret to the background script
        browser.runtime.sendMessage({ command: 'setSecret', secret: secret })
            .then(() => {
                console.log("Message sent to background script.");

                // Display a success message
                message.textContent = 'Secret saved!';
                message.style.display = 'block';

                // Hide the message after a short delay
                setTimeout(() => {
                    message.style.display = 'none';
                }, 2000);
            })
            .catch((error) => {
                console.error("Error sending message to background script:", error);
                message.textContent = 'Failed to save secret.';
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
