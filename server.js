const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./models");
const Role = db.role;
const Doctor = db.doctor;
const Appointment = db.appointment;

const app = express();

let corsOptions = {
  origin: ["https://medbook-vistacentro.netlify.app", "http://localhost:3000"]
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

// db.sequelize.sync().then(() => {
//   console.log("Drop and Resync Db");
//
// });


const accountSid = 'AC1947373f2ca9f65ba9639ba8a8225374';
const authToken = 'd1df471b4c7c4b23f3cf99622ae0f731';
const client = require('twilio')(accountSid, authToken);

client.messages
    .create({
      body: 'El centro clinico vista centro le informa que su cita fue agendada,',
      messagingServiceSid: 'MGf95103e4cda1035962adcfc275e47d7d',
      to: '+18152950339'
    })
    .then(message => console.log(message.sid))
