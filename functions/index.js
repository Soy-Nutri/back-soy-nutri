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
app.use("/auth", require("./routes/auth"));

//export
exports.api = functions.https.onRequest(app);
