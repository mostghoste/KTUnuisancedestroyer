importScripts('sha.js'); // Import the jsSHA library if needed

// Function to convert base32 to hex
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

// Function to generate TOTP
function generateTOTP(secret) {
    const epoch = Math.round(new Date().getTime() / 1000.0);
    const time = Math.floor(epoch / 30).toString(16).padStart(16, '0');

    const shaObj = new jsSHA("SHA-1", "HEX");
    shaObj.setHMACKey(base32tohex(secret), "HEX");
    shaObj.update(time);
    const hmac = shaObj.getHMAC("HEX");

    const offset = parseInt(hmac.substring(hmac.length - 1), 16);
    const binary = parseInt(hmac.substring(offset * 2, offset * 2 + 8), 16) & 0x7fffffff;
    const otp = binary % 1000000;

    return otp.toString().padStart(6, '0');
}

// Listen for messages from content script
onmessage = function(event) {
    const { secret } = event.data;
    const totpCode = generateTOTP(secret);
    postMessage(totpCode);
};
