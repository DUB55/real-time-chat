// public/script.js
const socket = io();  // Initialize the Socket.IO client

const startChatBtn = document.getElementById('start-chat');
const nameInput = document.getElementById('name-input');
const chatContainer = document.getElementById('chat-container');
const messages = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

let username = '';  // Variable to store the username

// Event listener to start the chat when the user enters their name
startChatBtn.addEventListener('click', () => {
  username = nameInput.value.trim();  // Get the entered username
  if (username) {
    document.querySelector('.welcome-container').style.display = 'none';
    chatContainer.style.display = 'block';
  }
});

// Event listener to send the message when the button is clicked
sendButton.addEventListener('click', () => {
  sendMessage();
});

// Event listener to send the message when Enter key is pressed
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Function to send a message
function sendMessage() {
  const message = messageInput.value.trim();
  if (message) {
    // Emit the message to the server
    socket.emit('chat message', { username, text: message });
    messageInput.value = '';  // Clear the input field
  }
}

// Listen for incoming chat messages from the server
socket.on('chat message', (msg) => {
  const item = document.createElement('li');
  item.innerHTML = `
    <span class="timestamp">${new Date().toLocaleTimeString()}</span>
    <span class="username">${msg.username}:</span>
    <span class="message-text">${msg.text}</span>
  `;
  messages.appendChild(item);  // Add the message to the list
  messages.scrollTop = messages.scrollHeight;  // Scroll to the latest message
});
