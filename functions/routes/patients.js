const express = require("express");
const app = express.Router();

const { db, firebase } = require("../utils/init");
const { AuthAdmin, AuthUser } = require("../utils/middlewareAuth");
const { isEmpty } = require("../utils/functions");

app.get("/getId", (req, res) => {
  db.collection("patients")
    .get()
    .then((snapshot) => {
      let data = [];
      snapshot.forEach((doc) => {
        data.push({
          [doc.id]: {
            rut: doc.data().rut,
            names: doc.data().names,
            father_last_name: doc.data().father_last_name,
            mother_last_name: doc.data().mother_last_name,
          },
        });
      });
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(502).json({ mensaje: err });
    });
});

module.exports = app;
