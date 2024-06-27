const {verifySignUp, authJwt} = require("../middleware");
const controller = require("../controllers/auth.controller");
const origen = ["http://localhost:3000", "http://10.0.0.121:3000", "https://vistacentro-citas.com", "https://seguros.vistacentro-citas.com/"]

module.exports = function (app) {
    app.use(function(req, res, next) {
        // Allow requests from any origin
        res.header("Access-Control-Allow-Origin", origin);

        // Allow specific headers for CORS requests
        res.header("Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept");

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


