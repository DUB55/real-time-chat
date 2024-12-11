const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

// Store chat messages
let chatHistory = [];

io.on('connection', (socket) => {
  // Send chat history to new users
  socket.emit('chat history', chatHistory);

  socket.on('chat message', (msg) => {
    chatHistory.push(msg);
    // Limit history to last 50 messages (optional)
    if (chatHistory.length > 50) {
      chatHistory = chatHistory.slice(-50);
    }
    io.emit('chat message', msg);
  });
});

http.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
