browser.runtime.onMessage.addListener((message) => {
    console.log("Background script received a message:", message);

    if (message.command === 'setSecret') {
        console.log("Setting shared secret:", message.secret);
        browser.storage.sync.set({ sharedSecret: message.secret }).then(() => {
            console.log("Shared secret stored successfully.");
        }).catch((error) => {
            console.error("Error storing shared secret:", error);
        });
    }
});
