// Connect to the Socket.IO server
const socket = io();

// DOM elements
const messagesList = document.getElementById("messages");
const sendMessageBtn = document.getElementById("sendMessageBtn");
const messageInput = document.getElementById("messageInput");
const nameInput = document.getElementById("nameInput");

// Function to append messages to the chat
function appendMessage(username, message) {
  const li = document.createElement("li");
  li.innerHTML = `<span class="username">${username}:</span> <span class="message-text">${message}</span>`;
  messagesList.appendChild(li);
  messagesList.scrollTop = messagesList.scrollHeight; // Scroll to the bottom
}

// Send message when the button is clicked
sendMessageBtn.addEventListener("click", () => {
  const message = messageInput.value.trim();
  const username = nameInput.value.trim() || "Anonymous";

  if (message) {
    socket.emit("chat message", { username, message }); // Emit message to the server
    messageInput.value = ""; // Clear input field
  }
});

// Listen for new messages from the server
socket.on("chat message", (msg) => {
  appendMessage(msg.username, msg.message);
});
