const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        min: 3,
        max: 20,
        unique: true,
        required: true
    },
    name: {
        type: String,
        min: 3,
        max: 20,
        unique: true,
        required: true
    },
    email: {
        type: String,
        max: 40,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    isAvatarImageSet: {
        type: Boolean,
        default: false
    },
    avatarImage: {
        type: String,
        default: "",
    },
})

module.exports = mongoose.model("users", userSchema);