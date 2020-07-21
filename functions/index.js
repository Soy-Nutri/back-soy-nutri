//Cloud Functions
const { functions } = require("./utils/init");

//imports
const express = require("express");
const cors = require("cors");

const app = express();

//uses
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/adminAuth", require("./routes/adminAuth"));
app.use("/admin", require("./routes/admin"));
app.use("/patientsAuth", require("./routes/patientsAuth"));
app.use("/patientsCarnet", require("./routes/patientsCarnet"));
app.use("/patientsDailyDiets", require("./routes/patientsDailyDiets"));
app.use("/patientsWeeklyDiets", require("./routes/patientsWeeklyDiets"));
app.use("/generalInfo", require("./routes/generalInfo"));

//export
exports.api = functions.https.onRequest(app);
