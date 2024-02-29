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
            const deviceInfo = formatDeviceInfo(data);
            displayMessage('System: ' + deviceInfo, 'system');
        })
        .catch(error => {
            console.error('Error:', error);
            displayMessage('System: Failed to retrieve device information.', 'system');
        });
}

function formatDeviceInfo(data) {
    // Check if device information is present
    if (!data || !data.gudid || !data.gudid.device) {
        return "No device information found.";
    }
    const device = data.gudid.device;
    let info = `Device Information:\n`;

    // Extracting key details
    if (device.brandName) info += `Brand Name: ${device.brandName}\n`;
    if (device.deviceDescription) info += `Description: ${device.deviceDescription}\n`;
    if (device.companyName) info += `Manufacturer: ${device.companyName}\n`;
    if (device.gmdnTerms && device.gmdnTerms.gmdn) {
        const gmdnTerm = device.gmdnTerms.gmdn[0];
        if (gmdnTerm && gmdnTerm.gmdnPTName) info += `GMDN Term: ${gmdnTerm.gmdnPTName}\n`;
    }
    if (device.expirationDate) info += `Expiration Date: ${device.expirationDate}\n`;
    if (device.manufacturingDate) info += `Manufacturing Date: ${device.manufacturingDate}\n`;

    // Formatting for display
    return info.replace(/\n/g, '<br>'); // Replace newline characters with HTML line breaks for web display
}

function displayMessage(message, sender) {
    const chatBox = document.getElementById('chat-box');
    const msgDiv = document.createElement('div');
    msgDiv.innerHTML = message; // Use innerHTML to interpret line breaks
    msgDiv.className = sender === 'user' ? 'user-message' : 'system-message';
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
}
