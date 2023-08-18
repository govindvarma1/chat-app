//jshint esversion:6
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const socket = require("socket.io");
const app = express();
const userRoutes = require("./Routes/userRoutes");
const messageRoute = require("./Routes/messagesRoute");
require("dotenv").config();

app.use(cors());
app.use(express.json());

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connected to mongodb succesfully");
    }
    catch (error) {
        console.log(err);
    }
}

main();

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);

const server = app.listen(process.env.PORT, () => {
    console.log(`server started on port ${process.env.PORT}`);
})

const io = socket(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    }
})

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    })
    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-receive", data.message)
        }
    });
});