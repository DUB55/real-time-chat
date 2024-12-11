const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(http);

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

const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
