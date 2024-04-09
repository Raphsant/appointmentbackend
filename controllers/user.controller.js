const db = require("../models");
const res = require("express/lib/response");
const e = require("express");
const {Op} = require("sequelize");
const user = db.user;
const role = db.role;

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

//sends user info to show at the profile page.
exports.userBoard = async (req, res) => {
    try {
        const targetUser = await user.findByPk(req.userId)
        await res.status(200).send({
            email: targetUser.email,
            firstName: targetUser.firstName,
            lastName: targetUser.lastName,
            username: targetUser.username,
            id: targetUser.id,
            phone: targetUser.phone

        });
    } catch (e) {
        res.status(500).send({message: e.message})
    }
};

//updates the user.
exports.updateUser = async (req, res) => {
    try {
        console.log(req.body.userId)
        if (req.userId !== req.body.userId) {
            throw new Error("Error, you are trying to modify another user that doesn't match your credentials")
        }
        const targetUser = await user.findByPk(req.userId)
        await targetUser.update(req.body.newData)
        res.status(200).send("Usuario modificado existosamente");
    } catch (e) {
        res.status(500).send({message: e.message})
    }
}

//displays all the users, only to be seen by admins or mods
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

//only to be used by admins or mods, it deletes the user from the DB
exports.deleteUser = async (req, res) => {
    try {
        const targetUser = await user.findByPk(req.body.id)
        await targetUser.destroy();
        res.status(200).send({message: "user deleted successfully"})
    } catch (e) {
        res.status(400).json({message: e.message})

    }
}
// displays user count, meant for admin panel
exports.userCount = async (req, res) => {
    try {
        const count = await user.count()
        res.status(200).json(count)
    } catch (e) {
        res.status(400).json({message: e.message})
    }
}

exports.elevateUser = async (req, res) => {
    try {
        console.log("THE BODY IS:")
        console.log(req.query.userId)
        const targetUser = await user.findByPk(req.query.userId);
        let adminRole = await role.findAll({
            where: {
                name: "admin"
            }
        })
        if (!adminRole) {
            adminRole = await role.create({
                id: 100,
                name: 'admin'
            })
        }
        await targetUser.addRole(adminRole);
        res.status(200).json({message: "User elevated successfully."})

    } catch (e) {
        res.status(400).json({message: e.message})
    }
}