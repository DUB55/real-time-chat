// api/socket.js
import { Server } from "socket.io";

export default function handler(req, res) {
  // Create the Socket.IO server
  if (res.socket.server.io) {
    console.log("Socket.io already initialized.");
  } else {
    const io = new Server(res.socket.server);

    io.on("connection", (socket) => {
      console.log("A user connected");

      // Listen for chat messages
      socket.on("chat message", (msg) => {
        io.emit("chat message", msg);
      });

      // Log when a user disconnects
      socket.on("disconnect", () => {
        console.log("A user disconnected");
      });
    });

    res.socket.server.io = io; // Store the io instance on the server
  }

  res.end(); // End the response
}
