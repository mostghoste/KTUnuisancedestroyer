console.log("Content script loaded.");

function executeWhenPageLoaded() {
    console.log("Page fully loaded. Attempting to retrieve shared secret...");

    // Retrieve the shared secret from the extension's storage
    browser.storage.sync.get('sharedSecret')
        .then((data) => {
            if (data.sharedSecret) {
                console.log("Shared secret retrieved:", data.sharedSecret);

                // Create a new worker for TOTP generation
                const totpWorker = new Worker(browser.runtime.getURL('totp-worker.js'));

                // Send the shared secret to the worker
                totpWorker.postMessage({ secret: data.sharedSecret });

                // Listen for the worker's response
                totpWorker.onmessage = function(event) {
                    const totpCode = event.data;
                    console.log("Generated TOTP code:", totpCode);

                    // Replace the selector below with the specific input field selector
                    const inputField = document.querySelector('input[name="totp"]');

                    if (inputField) {
                        console.log("Input field found. Inserting TOTP code...");

                        // Fill in the TOTP code
                        inputField.value = totpCode;

                        // Trigger an input event to notify the page of the change
                        inputField.dispatchEvent(new Event('input', { bubbles: true }));
                    } else {
                        console.error("Input field not found. Check the selector.");
                    }
                };
            } else {
                console.error("Shared secret not found. Make sure it's set.");
            }
        })
        .catch((error) => {
            console.error("Error retrieving shared secret:", error);
        });
}

// Check if the document is already loaded
if (document.readyState === 'complete') {
    // If the document is already fully loaded, run the script immediately
    executeWhenPageLoaded();
} else {
    // Otherwise, wait for the load event
    window.addEventListener('load', executeWhenPageLoaded);
}
