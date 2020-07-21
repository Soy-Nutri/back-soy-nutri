const express = require("express");
const app = express.Router();

const { db, firebase } = require("../utils/init");
const { isEmpty } = require("../utils/functions");
const { AuthAdmin, AuthUser } = require("../utils/middlewareAuth");

app.post("/push", AuthAdmin, (req, res) => {
  const rut = req.body.rut.toString();
  const control = {
    date: req.body.date.toString(),
    weight: req.body.weight.toString(), // kg
    size: req.body.size.toString(), // m
    cbr: req.body.cbr.toString(), //cm
    cbc: req.body.cbc.toString(), // cm
    cc_min: req.body.cc_min.toString(), // cm
    cc_max: req.body.cc_max.toString(), // cm
    cad_max: req.body.cad_max.toString(), //cm
    triceps_fold: req.body.triceps_fold.toString(), // mm
    subscapular_fold: req.body.subscapular_fold.toString(), // mm
    abdominal_fold: req.body.abdominal_fold.toString(), // mm
    imc: req.body.imc.toString(), // kg/mt2
    dni: req.body.dni.toString(),
    biological_age: req.body.biological_age.toString(),
    visceral_fat: req.body.visceral_fat.toString(),
    fat: req.body.fat.toString(), // %
    mass: req.body.mass.toString(), // %
    muscle_mass: req.body.muscle_mass.toString(), // kg
  };

  let errors = {};
  if (isEmpty(rut)) errors.rut = "Must no be empty";
  if (isEmpty(control.date)) errors.date = "Must no be empty";
  else control.date = new Date(control.date).toISOString();

  if (isEmpty(control.weight)) errors.weight = "Must no be empty";
  if (isEmpty(control.size)) errors.size = "Must no be empty";
  if (isEmpty(control.cbr)) errors.cbr = "Must no be empty";
  if (isEmpty(control.cbc)) errors.cbc = "Must no be empty";
  if (isEmpty(control.cc_min)) errors.cc_min = "Must no be empty";
  if (isEmpty(control.cc_max)) errors.cc_max = "Must no be empty";
  if (isEmpty(control.cad_max)) errors.cad_max = "Must no be empty";
  if (isEmpty(control.triceps_fold)) errors.triceps_fold = "Must no be empty";
  if (isEmpty(control.subscapular_fold))
    errors.subscapular_fold = "Must no be empty";
  if (isEmpty(control.abdominal_fold))
    errors.abdominal_fold = "Must no be empty";
  if (isEmpty(control.imc)) errors.imc = "Must no be empty";
  if (isEmpty(control.dni)) errors.dni = "Must no be empty";
  if (isEmpty(control.biological_age))
    errors.biological_age = "Must no be empty";
  if (isEmpty(control.visceral_fat)) errors.visceral_fat = "Must no be empty";
  if (isEmpty(control.fat)) errors.fat = "Must no be empty";
  if (isEmpty(control.mass)) errors.mass = "Must no be empty";
  if (isEmpty(control.muscle_mass)) errors.muscle_mass = "Must no be empty";

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  db.doc(`/patients/${rut}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        if (doc.data().controls) {
          let dates = [];
          for (let i = 0; i < doc.data().controls.length; i++) {
            dates.push(doc.data().controls[i].date);
          }
          if (dates.indexOf(control.date) === -1) {
            let newControls = doc.data().controls;
            newControls.push(control);
            db.collection("patients")
              .doc(rut)
              .update({ controls: newControls });
            return res.status(200).json({ message: "Push control." });
          } else {
            return res
              .status(400)
              .json({ error: "Check date is already entered." });
          }
        } else {
          db.collection("patients")
            .doc(rut)
            .update({ controls: [control] });
          return res.status(200).json({ message: "Append control." });
        }
      } else {
        return res.status(400).json({ error: "User not found." });
      }
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
});

module.exports = app;
