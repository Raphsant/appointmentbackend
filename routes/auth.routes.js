const {verifySignUp, authJwt} = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Access-Control-Allow-Origin",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/auth/signup",
        [verifySignUp.checkDuplicateUsernameOrEmail],
        controller.signup
    );

    app.post("/api/auth/signin", controller.signin);

    app.get("/api/auth/validate", controller.validateTokenJwt);
    app.get("/api/auth/rolecheck", authJwt.isModeratorOrAdmin, controller.checkPrivileges)
};


