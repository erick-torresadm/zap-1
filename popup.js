document.getElementById('activate').addEventListener('click', function() {
    const key = document.getElementById('keyInput').value;
    const errorMessage = document.getElementById('errorMessage');
    
    if (!key) {
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Por favor, insira uma chave';
        return;
    }

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            files: ['saveContacts.js']
        }, () => {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'init',
                key: key
            });
        });
    });
});