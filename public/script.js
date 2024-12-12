const socket = io();

const startChatBtn = document.getElementById('start-chat');
const nameInput = document.getElementById('name-input');
const chatContainer = document.getElementById('chat-container');
const messages = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

let username = '';

startChatBtn.addEventListener('click', () => {
  username = nameInput.value.trim();
  if (username) {
    document.querySelector('.welcome-container').style.display = 'none';
    chatContainer.style.display = 'block';
  }
});

sendButton.addEventListener('click', () => {
  sendMessage();
});

messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

function sendMessage() {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('chat message', { username, text: message });
    messageInput.value = '';
  }
}

socket.on('chat message', ({ username, text }) => {
  const item = document.createElement('li');
  item.innerHTML = `<span class="timestamp">${new Date().toLocaleTimeString()}</span>
                    <span class="username">${username}:</span>
                    <span class="message-text">${text}</span>`;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});
