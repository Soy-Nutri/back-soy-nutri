const express = require("express");
const app = express.Router();

const { db, firebase } = require("../utils/init");
const { AuthAdmin, AuthUser } = require("../utils/middlewareAuth");

module.exports = app;
