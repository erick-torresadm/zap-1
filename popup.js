document.getElementById('activate').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id}, // Usa o ID da aba ativa
            files: ['saveContacts.js'] // Script que será executado
        });
    });
});
