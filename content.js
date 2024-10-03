console.log("Content script loaded.");

function base32tohex(base32) {
    const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let bits = "";
    let hex = "";

    for (let i = 0; i < base32.length; i++) {
        const val = base32chars.indexOf(base32.charAt(i).toUpperCase());
        bits += val.toString(2).padStart(5, '0');
    }

    for (let i = 0; i + 4 <= bits.length; i += 4) {
        const chunk = bits.substring(i, i + 4);
        hex += parseInt(chunk, 2).toString(16);
    }

    return hex;
}

function generateTOTP(secret) {
    const epoch = Math.round(new Date().getTime() / 1000.0);
    const time = Math.floor(epoch / 30).toString(16).padStart(16, '0');

    // Use jsSHA library for HMAC-SHA1 (include this library in your extension)
    const shaObj = new jsSHA("SHA-1", "HEX");
    shaObj.setHMACKey(base32tohex(secret), "HEX");
    shaObj.update(time);
    const hmac = shaObj.getHMAC("HEX");

    const offset = parseInt(hmac.substring(hmac.length - 1), 16);
    const binary = parseInt(hmac.substring(offset * 2, offset * 2 + 8), 16) & 0x7fffffff;
    const otp = binary % 1000000;

    return otp.toString().padStart(6, '0');
}

function executeWhenPageLoaded() {
    console.log("Page fully loaded. Attempting to retrieve shared secret...");

    // Retrieve the shared secret from the extension's storage
    browser.storage.sync.get('sharedSecret')
        .then((data) => {
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
