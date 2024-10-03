// content.js
import { generateTOTP } from './totp.js'; // Use this if totp.js is an ES module

console.log("Content script loaded.");

window.addEventListener('load', () => {
    console.log("Page fully loaded. Attempting to retrieve shared secret...");

    // Retrieve the shared secret from the extension's storage
    browser.storage.sync.get('sharedSecret', (data) => {
        if (data.sharedSecret) {
            console.log("Shared secret retrieved:", data.sharedSecret);

            // Generate the TOTP code using the shared secret
            const totpCode = generateTOTP(data.sharedSecret);
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
        } else {
            console.error("Shared secret not found. Make sure it's set.");
        }
    });
});
