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
app.use("/patients", require("./routes/patients"));
app.use("/patientsAuth", require("./routes/patientsAuth"));
app.use("/general", require("./routes/generalInfo"));

//export
exports.api = functions.https.onRequest(app);
