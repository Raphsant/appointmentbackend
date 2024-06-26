const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;

let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    // Save User to Database
    User.create({
        id: req.body.id,
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
    })
        .then((user) => {
            if (req.body.roles) {
                Role.findAll({
                    where: {
                        name: {
                            [Op.or]: req.body.roles,
                        },
                    },
                }).then((roles) => {
                    user.setRoles(roles).then(() => {
                        res.send({message: "User was registered successfully!"});
                    });
                });
            } else {
                // user role = 1
                user.setRoles([1]).then(() => {
                    res.send({message: "User was registered successfully!"});
                });
            }
        })
        .catch((err) => {
            res.status(500).send({message: err.message});
        });
};

exports.signin = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                username: req.body.username,
            }
        })
        if (!user) return res.status(401).send({error: "Usuario no existe."});

        let passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        )

        if (!passwordIsValid) {
            return res.status(401).send({
                token: null,
                error: "Contraseña invalida!",
            });
        }

        let token = jwt.sign({id: user.id}, config.secret, {
            expiresIn: 86400, // 24 hours
        });

        let authorities = [];

        const roles = await user.getRoles();
        for (let i = 0; i < roles.length; i++) {
            authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }

        res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: authorities,
            token: token,
        });
    } catch (e) {
        res.status(400).send({message: e.message})
    }
};

exports.validateTokenJwt = (req, res) => {
    try {
        let token = req.headers["x-access-token"];
        if (!token) {
            return res.status(403).send({
                message: "No token provided!",
            });
        }
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    message: "Unauthorized!",
                });
            }
            console.log("valid token!");
            return res.status(200).send(200);
        });
    } catch (e) {
        console.error(e);
    }
};

exports.checkPrivileges = async (req, res) => {
    try {
        return res.status(200).send('OK')

    } catch (e) {
        return res.status(400).send('unexpected error')
    }
}
