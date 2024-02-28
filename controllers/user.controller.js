const db = require("../models");
const user = db.user;

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.userBoard = async (req, res) => {
    try {
        console.log(req.query)
        const targetUser = await user.findByPk(req.query.userId)
        await res.status(200).send({
            email: targetUser.email,
            firstName: targetUser.firstName,
            lastName: targetUser.lastName,
            username: targetUser.username,
            id: targetUser.id

        });
    } catch (e) {
        res.status(500).send({message: e.message})
    }
};


exports.updateUser = async (req, res) => {
    try {
        console.log(req.body)
        const targetUser = await user.findByPk(req.query.userId)
        if (req.query.userId != targetUser.id) {
            throw new Error("No puedes modificar otro usuario.")
        }
        await targetUser.update(req.body)
        res.status(200).send("Usuario modificado existosamente");
    } catch (e) {
        res.status(500).send({message: e.message})
    }
}


// exports.userBoard = (req, res) => {
//     res.status(200).send("User Content.");
// };

exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
};

