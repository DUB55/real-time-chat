const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(http, {
  cors: {
    origin: "https://real-time-chat-fsgmg1n6b-dub55s-projects.vercel.app",
    methods: ["GET", "POST"]
  }
});

app.use(express.static('public'));

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://real-time-chat-fsgmg1n6b-dub55s-projects.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Store chat messages with timestamps
let chatHistory = [];

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send chat history to new users
  socket.emit('chat history', chatHistory);

  socket.on('chat message', (msg) => {
    console.log('Message received:', msg);
    // Store the message with timestamp
    chatHistory.push(msg);
    
    // Limit history to last 50 messages
    if (chatHistory.length > 50) {
      chatHistory = chatHistory.slice(-100);
    }
    
    // Broadcast the message to all connected clients
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
