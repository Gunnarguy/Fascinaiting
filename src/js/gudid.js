document.getElementById('send-btn').addEventListener('click', function() {
    const input = document.getElementById('chat-input');
    const message = input.value;
    if (!message) {
        alert('Please enter a value.');
        return;
    }
    displayMessage('You: ' + message, 'user');
    fetchDeviceInfo(message);
    input.value = ''; // Clear input after sending
});

function fetchDeviceInfo(di) {
    const url = `https://accessgudid.nlm.nih.gov/api/v3/devices/lookup.json?di=${encodeURIComponent(di)}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayMessage('System: ' + JSON.stringify(data, null, 2), 'system');
            
            // Display all fields
            Object.keys(data.gudid.device).forEach(key => {
                if (typeof data.gudid.device[key] === 'object' && data.gudid.device[key] !== null) {
                    Object.keys(data.gudid.device[key]).forEach(subKey => {
                        displayMessage(`${subKey}: ${JSON.stringify(data.gudid.device[key][subKey], null, 2)}`, 'system');
                    });
                } else {
                    displayMessage(`${key}: ${data.gudid.device[key]}`, 'system');
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
            displayMessage('System: Failed to retrieve device information.', 'system');
        });
}

function displayMessage(message, sender) {
    const chatBox = document.getElementById('chat-box');
    const msgDiv = document.createElement('div');
    msgDiv.textContent = message;
    msgDiv.className = sender === 'user' ? 'user-message' : 'system-message';
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
}