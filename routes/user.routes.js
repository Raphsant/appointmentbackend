const {authJwt} = require("../middleware");
const controller = require("../controllers/user.controller");
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

    app.get("/api/test/all", authJwt.verifyToken, controller.allAccess);
    app.get("/api/user/getAll", authJwt.verifyToken, authJwt.isAdmin, controller.getAllUsers);
    app.get("/api/user/count", authJwt.verifyToken, authJwt.isAdmin, controller.userCount);
    // app.get("/api/test/user", authJwt.verifyToken, controller.userBoard);
    app.get("/api/user/profile", authJwt.verifyToken, controller.userBoard);
    app.get("/api/user/getUser", controller.getUser);
    app.post("/api/user/update", authJwt.verifyToken, controller.updateUser);
    app.post("/api/user/delete", authJwt.verifyToken, controller.deleteUser);
    app.post("/api/user/elevate", authJwt.verifyToken, authJwt.isAdmin, controller.elevateUser);


    // app.get(
    //   "/api/test/mod",
    //   [verifyToken, authJwt.isModerator],
    //   controller.moderatorBoard
    // );
    //
    // app.get(
    //   "/api/test/admin",
    //   [verifyToken, authJwt.isAdmin],
    //   controller.adminBoard
    // );
};
