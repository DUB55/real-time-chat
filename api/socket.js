// api/socket.js
import { Server } from "socket.io";

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log("Socket.io already initialized.");
  } else {
    const io = new Server(res.socket.server);

    io.on("connection", (socket) => {
      console.log("A user connected");

      socket.on("chat message", (msg) => {
        io.emit("chat message", msg);
      });

      socket.on("disconnect", () => {
        console.log("A user disconnected");
      });
    });

    res.socket.server.io = io;
  }

  res.end(); // End the response
}
