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
    try {
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
    } catch (error) {
        console.error("TOTP generation failed. Please verify the shared secret.");
        throw error; // Re-throw the error to be caught in the outer promise chain if needed
    }
}

function executeWhenPageLoaded() {
    console.log("Page fully loaded. Attempting to retrieve shared secret...");

    // Retrieve the shared secret and auto-login setting from storage
    browser.storage.local.get(['sharedSecret', 'autoLogin'])
        .then((data) => {
            if (data.sharedSecret) {
                console.log("Shared secret found and retrieved.");

                try {
                    // Generate the TOTP code using the shared secret
                    const totpCode = generateTOTP(data.sharedSecret);
                    console.log("Generated TOTP code:", totpCode);

                    // Find the input field to insert the OTP
                    const inputField = document.querySelector('input[name="otp"]');

                    if (inputField) {
                        console.log("Input field found. Inserting TOTP code...");

                        // Fill in the TOTP code
                        inputField.value = totpCode;

                        // Trigger an input event to notify the page of the change
                        inputField.dispatchEvent(new Event('input', { bubbles: true }));

                        // Check if auto-login is enabled and trigger the login button click
                        if (data.autoLogin) {
                            console.log("Auto-login is enabled. Attempting to press the login button...");
                            const loginButton = document.querySelector('input[type="submit"]'); // Updated selector
                            if (loginButton) {
                                setTimeout(() => {
                                    loginButton.click();
                                    console.log("Login button clicked.");
                                }, 500); // 500 milliseconds delay
                            } else {
                                console.error("Login button not found. Check the selector.");
                            }
                        }                        
                        else {
                            console.log("Autologin disabled.")
                        }
                    } else {
                        console.error("Input field not found. Check the selector.");
                    }
                } catch (error) {
                    console.error("An error occurred during TOTP generation. Please check the shared secret.");
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
