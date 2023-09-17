//jshint esversion:6
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const socket = require("socket.io");
const passport = require("passport");
const cookieSession = require("cookie-session");
const app = express();
const passportSetup = "./passport";
const userRoutes = require("./Routes/userRoutes");
const messageRoute = require("./Routes/messagesRoute");
const authRoutes = require("./Routes/auth");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(
    cookieSession({
        name: "session",
        keys: ["chat-app"],
        maxAge: 24 * 60 * 60 * 100
    })
);
app.use(passport.initialize());
app.use(passport.session());

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
app.use("/api/auth", authRoutes);
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
            socket.to(sendUserSocket).emit("msg-receive", { message: data.message, to: data.to })
        }
    });
});