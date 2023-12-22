import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
const window = dom.window;
const document = window.document;

document.addEventListener('DOMContentLoaded', function() {
    // Select the form element and chat window elements
    const form = document.querySelector('#chat-form');
    const chatWindow = document.querySelector('#chat-window');

    // Event listener for form submission
    form.addEventListener('submit', function(event) {
        // Prevent default form submission
        event.preventDefault();

        // Extract user input from the text input field
        const userInput = document.querySelector('#message-input').value;

        // Construct the POST request
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/submit-message');
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        // Handle the response
        xhr.onload = function() {
            if (xhr.status === 200) {
                // Parse the response and update the chat window
                const response = JSON.parse(xhr.responseText);
                const replyElement = document.createElement('p');
                replyElement.textContent = response.reply;
                chatWindow.appendChild(replyElement);
            } else {
                // Handle errors
                console.error('Error from the backend:', xhr.status, xhr.statusText);
            }
        };
        
        // Send POST request with user message
        xhr.send(JSON.stringify({ message: userInput }));
        
        // Clear the input field
        document.querySelector('#message-input').value = '';
    });
});
