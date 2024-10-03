document.getElementById('save').addEventListener('click', () => {
    const secret = document.getElementById('secret').value;
    console.log("Save button clicked. Secret entered:", secret);

    if (secret) {
        // Send the shared secret to the background script
        browser.runtime.sendMessage({ command: 'setSecret', secret: secret })
            .then(() => {
                console.log("Message sent to background script.");
                alert('Shared secret saved!');
            })
            .catch((error) => {
                console.error("Error sending message to background script:", error);
            });
    } else {
        console.error("No secret entered.");
    }
});
