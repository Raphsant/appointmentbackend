const db = require("../models");
const res = require("express/lib/response");
const e = require("express");
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

exports.getAllUsers = async (req, res) => {
    try {
        const userList = await user.findAll({
            attributes:
                {exclude: ['password']}

        });
        res.status(200).json(userList);
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

exports.deleteUser = async (req, res) => {
    try {
        const targetUser = await user.findByPk(req.body.id)
        await targetUser.destroy();
        res.status(200).send({message: "user deleted successfully"})
    } catch (e) {
        res.status(400).json({message: e.message})

    }
}
exports.userCount = async (req,res) => {
    try{
        const count = await user.count()
        res.status(200).json(count)
    }catch (e) {
        res.status(400).json({message: e.message})
    }
}