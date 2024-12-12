// api/server.js
import { Server } from "socket.io";

const ioHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket.io already initialized");
  } else {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("A user connected");

      // Listen for incoming chat messages
      socket.on("chat message", (msg) => {
        console.log("Received message: ", msg);
        // Emit the message to all connected clients
        io.emit("chat message", msg);
      });

      socket.on("disconnect", () => {
        console.log("A user disconnected");
      });
    });
  }
  res.end();
};

export default ioHandler;
