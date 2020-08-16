const express = require("express");
const app = express.Router();

const { db, firebase } = require("../utils/init");
const {
  AuthAdmin,
  AuthUser,
  decideMiddleware,
} = require("../utils/middlewareAuth");
const { isEmpty } = require("../utils/functions");

app.get("/getId", AuthAdmin, (req, res) => {
  db.collection("patients")
    .get()
    .then((snapshot) => {
      let data = [];
      snapshot.forEach((doc) => {
        data.push({
          rut: doc.data().rut,
          names: doc.data().names,
          father_last_name: doc.data().father_last_name,
          mother_last_name: doc.data().mother_last_name,
        });
      });
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({ mensaje: err });
    });
});

app.get("/getPerfil/:rut/:user", decideMiddleware, (req, res) => {
  db.doc(`/patients/${req.params.rut}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(200).json({
          rut: doc.data().rut,
          names: doc.data().names,
          father_last_name: doc.data().father_last_name,
          mother_last_name: doc.data().mother_last_name,
          city: doc.data().city,
          in_date: doc.data().in_date,
          email: doc.data().email,
          phone: doc.data().phone,
          birth_date: doc.data().birth_date,
          sex: doc.data().sex,
          alimentation: doc.data().alimentation,
          state: doc.data().state,
        });
      } else {
        return res.status(404).json({ message: "User not found." });
      }
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
});

app.post("/deletePerfil", AuthAdmin, (req, res) => {
  const rut = req.body.rut;
  console.log(req.body.rut);
  db.doc(`/patients/${rut}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        db.doc(`/patients/${rut}`).update({ state: "inactivo" });
        return res.status(200).json({ message: "Change state user." });
      } else {
        return res.status(404).json({ message: "User not found." });
      }
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
});

app.post("/activePerfil", AuthAdmin, (req, res) => {
  const rut = req.body.rut;
  db.doc(`/patients/${rut}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        db.doc(`/patients/${rut}`).update({ state: "activo" });
        return res.status(200).json({ message: "Change state user." });
      } else {
        return res.status(404).json({ message: "User not found." });
      }
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
});

app.post("/modifyPerfil", AuthAdmin, (req, res) => {
  const rut = req.body.rut;
  const newPerfil = {
    names: req.body.names,
    father_last_name: req.body.father_last_name,
    mother_last_name: req.body.mother_last_name,
    city: req.body.city,
    state: req.body.state,
    in_date: req.body.in_date,
    email: req.body.email,
    phone: req.body.phone,
    birth_date: req.body.birth_date,
    sex: req.body.sex,
    alimentation: req.body.alimentation,
  };

  const notEmptyPerfil = {};

  let errors = {};
  if (isEmpty(rut)) errors.rut = "Must no be empty";
  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  if (!isEmpty(newPerfil.names)) notEmptyPerfil.names = newPerfil.names;
  if (!isEmpty(newPerfil.father_last_name))
    notEmptyPerfil.father_last_name = newPerfil.father_last_name;
  if (!isEmpty(newPerfil.mother_last_name))
    notEmptyPerfil.mother_last_name = newPerfil.mother_last_name;
  if (!isEmpty(newPerfil.city)) notEmptyPerfil.city = newPerfil.city;
  if (!isEmpty(newPerfil.state)) notEmptyPerfil.state = newPerfil.state;
  if (!isEmpty(newPerfil.email)) notEmptyPerfil.email = newPerfil.email;
  if (!isEmpty(newPerfil.phone)) notEmptyPerfil.phone = newPerfil.phone;
  if (!isEmpty(newPerfil.birth_date))
    notEmptyPerfil.birth_date = new Date(newPerfil.birth_date).toISOString();
  if (!isEmpty(newPerfil.sex)) notEmptyPerfil.sex = newPerfil.sex;
  if (!isEmpty(newPerfil.alimentation))
    notEmptyPerfil.alimentation = newPerfil.alimentation;

  db.doc(`/patients/${rut}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        db.doc(`/patients/${rut}`).update(notEmptyPerfil);
        return res.status(200).json({ message: "Change perfil user." });
      } else {
        return res.status(404).json({ message: "User not found." });
      }
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
});

module.exports = app;
