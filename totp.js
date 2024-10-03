// totp.js
importScripts('sha.js');

function generateTOTP(secret) {
    console.log("Generating TOTP code for secret:", secret);

    // Helper function to convert base32 to hex
    function base32tohex(base32) {
        console.log("Converting base32 secret to hex...");
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

        console.log("Hexadecimal secret:", hex);
        return hex;
    }

    // Function to generate the TOTP code
    function getTOTP(secret) {
        console.log("Calculating TOTP code...");

        const epoch = Math.round(new Date().getTime() / 1000.0);
        const time = Math.floor(epoch / 30).toString(16).padStart(16, '0');

        // Use jsSHA for HMAC-SHA1
        const shaObj = new jsSHA("SHA-1", "HEX");
        shaObj.setHMACKey(base32tohex(secret), "HEX");
        shaObj.update(time);
        const hmac = shaObj.getHMAC("HEX");

        // Calculate the offset
        const offset = parseInt(hmac.substring(hmac.length - 1), 16);
        const binary = parseInt(hmac.substring(offset * 2, offset * 2 + 8), 16) & 0x7fffffff;

        // Generate the 6-digit TOTP code
        const otp = binary % 1000000;
        console.log("Generated TOTP code:", otp);
        return otp.toString().padStart(6, '0');
    }

    return getTOTP(secret);
}