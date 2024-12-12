const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(http, {
  cors: {
    origin: "https://real-time-chat-eosin-rho.vercel.app",
    methods: ["GET", "POST"]
  }
});

app.use(express.static('public'));

const { MongoClient } = require('mongodb');
const mongoUrl = process.env.MONGODB_URI; // Your MongoDB connection string
const client = new MongoClient(mongoUrl);
let chatCollection;

async function connectDB() {
  await client.connect();
  const db = client.db('chatapp');
  chatCollection = db.collection('messages');
}

io.on('connection', async (socket) => {
  console.log('User connected:', socket.id);

  // Send chat history to new users
  const chatHistory = await chatCollection.find({}).sort({ timestamp: -1 }).limit(50).toArray();
  socket.emit('chat history', chatHistory);

  socket.on('chat message', async (msg) => {
    console.log('Message received:', msg);
    await chatCollection.insertOne({ ...msg, timestamp: new Date() });
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

// Call connectDB before starting the server
connectDB().catch(console.error);

module.exports = app;
