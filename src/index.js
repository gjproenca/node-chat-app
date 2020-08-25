const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

// Io relates to the server and sends the message to all connections
// Socket relates to the current connection and sends the message to the current connection
// Boradcast sends the message to everybody except the current connection
io.on("connection", (socket) => {
  console.log("New WebSocket Connection");

  socket.emit("message", "Welcome!");
  socket.broadcast.emit("message", "A new user has joined!");

  socket.on("sendMessage", (message) => {
    io.emit("message", message);
  });

  socket.on("sendLocation", (coords) => {
    io.emit("message", `https://google.com/maps?q=${coords.latitude},${coords.longitude}`);
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user has left!");
  });
});

server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
