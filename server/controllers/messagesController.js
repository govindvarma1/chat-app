const messageModel = require("../model/messageModel");

module.exports.addMessage = async (req, res, next) => {
    try {
        const { from, to, message } = req.body;
        const data = await messageModel.create({
            message: {
                text: message,
            },
            users: [from, to],
            sender: from,
        })
        if (data) return res.json({ msg: "message added successfully" })
    }
    catch (ex) {
        next(ex);
    }
}


module.exports.getAllMessages = async (req, res, next) => {
    try {
        const { from, to } = req.body;
        const messages = await messageModel.find({
            users: {
                $all: [from, to],
            }
        }).sort({ updatedAt: 1 });
        const projectedMessages = messages.map((msg) => {
            const t = new Date(msg.createdAt);
            let time = t.getHours() + ":" + t.getMinutes();
            let date = t.getDate() + "/" + (t.getMonth() + 1) + "/" + t.getFullYear();
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
                time: time,
                date: date
            }
        })
        res.json(projectedMessages);
    }
    catch (ex) {
        next(ex);
    }
}