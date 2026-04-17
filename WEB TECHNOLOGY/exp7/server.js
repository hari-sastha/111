// Import required modules
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

// Create express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Attach socket.io to server
const io = new Server(server);

// Serve static files from public folder
app.use(express.static("public"));

// When user connects
io.on("connection", (socket) => {
    console.log("A user connected");

    // Listen for chat message
    socket.on("chat message", (data) => {

        // Send message to all users
        io.emit("chat message", data);
    });

    // When user disconnects
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

// Start server
server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});