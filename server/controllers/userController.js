const User = require("../model/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password, name } = req.body;
        const userNameCheck = await User.findOne({ username: username });
        if (userNameCheck) {
            return res.json({ msg: "Username already used", status: false })
        }
        const emailCheck = await User.findOne({ email: email });
        if (emailCheck) {
            return res.json({ msg: "email already used", status: false })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username: username,
            email: email,
            password: hashedPassword,
            name: name
        })
        delete user.password;
        return res.json({ status: true, user: user });
    }
    catch (ex) {
        next(ex);
    }
}

module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.json({ msg: "incorrect username or password", status: false })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json({ msg: "incorrect username or password", status: false })
        }
        delete user.password;
        return res.json({ status: true, user: user });
    }
    catch (ex) {
        next(ex);
    }
}

module.exports.setAvatar = async (req, res, next) => {
    try {
        const userId = req.params._id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage: avatarImage
        });
        return res.json({ isSet: userData.isAvatarImageSet, image: userData.avatarImage });
    }
    catch (ex) {
        next(ex);
    }
}


module.exports.getAllUsers = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const users = await User.find({ _id: { $ne: userId } }).select([
            "email", "username", "avatarImage", "_id", "name"
        ]);
        return res.json([users]);
    }
    catch (ex) {
        next(ex)
    }
}

