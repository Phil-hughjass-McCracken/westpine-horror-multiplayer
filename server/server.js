const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" } // allow any frontend
});

// when someone connects
io.on("connection", (socket) => {
  console.log("A player connected:", socket.id);

  // broadcast player joined
  socket.broadcast.emit("playerJoined", socket.id);

  // handle player movement
  socket.on("move", (data) => {
    socket.broadcast.emit("playerMoved", { id: socket.id, ...data });
  });

  // handle disconnect
  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
    io.emit("playerLeft", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
