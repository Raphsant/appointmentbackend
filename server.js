const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./models");
const Role = db.role;
const Doctor = db.doctor;
const Appointment = db.appointment;

const app = express();

let corsOptions = {
  origin: "https://sistemadecitas.netlify.app",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "hello world" });
});

require("./routes/auth.routes")(app);

require("./routes/user.routes")(app);

require("./routes/doctor.routes")(app);

require("./routes/appointment.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 5432;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

db.sequelize.sync().then(() => {
  console.log("Drop and Resync Db");

});
