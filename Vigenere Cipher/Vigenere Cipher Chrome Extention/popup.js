document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("encryptButton").addEventListener("click", encrypt);
    document.getElementById("decryptButton").addEventListener("click", decrypt);
});

function isValidKey(key) {
    return /^[A-Z]+$/.test(key); // Check if key contains only letters
}

function doEncryption(text, key) {
    let encryptedText = "";
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char.match(/[A-Z]/)) {
            const charCode = char.charCodeAt(0) - 65;
            const keyCharCode = key[keyIndex % key.length].charCodeAt(0) - 65;
            const encryptedCharCode = (charCode + keyCharCode) % 26;
            encryptedText += String.fromCharCode(encryptedCharCode + 65);
            keyIndex++;
        } else {
            encryptedText += char;
        }
    }

    return encryptedText;
}

function doDecryption(text, key) {
    let decryptedText = "";
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char.match(/[A-Z]/)) {
            const charCode = char.charCodeAt(0) - 65;
            const keyCharCode = key[keyIndex % key.length].charCodeAt(0) - 65;
            const decryptedCharCode = (charCode - keyCharCode + 26) % 26;
            decryptedText += String.fromCharCode(decryptedCharCode + 65);
            keyIndex++;
        } else {
            decryptedText += char;
        }
    }
    return decryptedText;
}

async function hashKey(key) {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray
        .map((byte) => String.fromCharCode(65 + (byte % 26)))
        .join("");
}

async function encrypt() {
    const plainText = document.getElementById("plainText").value.toUpperCase();
    let firstKey = document
        .getElementById("password")
        .value.toUpperCase()
        .replace(/\s+/g, ""); // Remove spaces

    if (!plainText || !firstKey) {
        alert("Please enter both plain text and password.");
        return;
    }

    if (!isValidKey(firstKey)) {
        alert("The password must contain only letters (A-Z).");
        return;
    }

    let secondKey = await hashKey(firstKey);

    let firstEncryption = doEncryption(plainText, firstKey);
    let secondEncryption = doEncryption(firstEncryption, secondKey);

    document.getElementById("operationTitle").textContent = "Encrypted Text:";
    document.getElementById("encryptedText").value = secondEncryption;
}

async function decrypt() {
    const encryptedText = document
        .getElementById("plainText")
        .value.toUpperCase();
    let firstKey = document
        .getElementById("password")
        .value.toUpperCase()
        .replace(/\s+/g, ""); // Remove spaces

    if (!encryptedText || !firstKey) {
        alert("Please enter both encrypted text and password.");
        return;
    }

    if (!isValidKey(firstKey)) {
        alert("The password must contain only letters (A-Z).");
        return;
    }

    let secondKey = await hashKey(firstKey);

    let firstDecryption = doDecryption(encryptedText, secondKey);
    let secondDecryption = doDecryption(firstDecryption, firstKey);

    document.getElementById("operationTitle").textContent = "Decrypted Text:";
    document.getElementById("encryptedText").value = secondDecryption;
}
