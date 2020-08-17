const express = require("express");
const app = express.Router();

const { db, firebase } = require("../utils/init");
const { isEmpty } = require("../utils/functions");
const {
  AuthAdmin,
  AuthUser,
  decideMiddleware,
} = require("../utils/middlewareAuth");

app.post("/addDailyDiet", AuthAdmin, (req, res) => {
  const rut = req.body.rut;
  const new_daily_diet = {
    date: new Date(req.body.date).toISOString(),
    breakfast: {
      time: req.body.breakfast_time,
      meal: req.body.breakfast,
    },
    lunch: {
      time: req.body.lunch_time,
      meal: req.body.lunch,
    },
    snack: {
      time: req.body.snack_time,
      meal: req.body.snack,
    },
    post_training: req.body.post_training,
    dinner: {
      time: req.body.dinner_time,
      meal: req.body.dinner,
    },
    calories: req.body.calories,
    proteins: req.body.proteins,
    goals: req.body.goals,
    extra_info: req.body.extra_info,
  };

  // TODO: revisar si es necesario comprobar campos vacios, ya que el ingreso de datos podria ser continuado
  // en otra oportunidad, dejando campos en blanco para llenarlos en otra ocasion pero guardando los que
  // ya ha completado

  // let errors = {};
  // const empty_error = "Must not be empty";
  // if (isEmpty(rut)) errors.rut = empty_error;
  // if (isEmpty(new_daily_diet.breakfast.meal)) errors.breakfast = empty_error;
  // if (isEmpty(new_daily_diet.lunch.meal)) errors.lunch = empty_error;
  // if (isEmpty(new_daily_diet.snack.meal)) errors.snack = empty_error;
  // if (isEmpty(new_daily_diet.post_training)) errors.post_training = empty_error;
  // if (isEmpty(new_daily_diet.dinner.meal)) errors.dinner = empty_error;
  // if (isEmpty(new_daily_diet.calories)) errors.calories = empty_error;
  // if (isEmpty(new_daily_diet.proteins)) errors.proteins = empty_error;
  // if (isEmpty(new_daily_diet.goals)) errors.goals = empty_error;
  // if (isEmpty(new_daily_diet.extra_info)) errors.extra_info = empty_error;

  // if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  db.doc(`/patients/${rut}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        // if the patient exists
        if (doc.data().daily_diets) {
          // if are daily diets in this patient
          let dates = [];
          for (let i = 0; i < doc.data().daily_diets.length; i++) {
            dates.push(doc.data().daily_diets[i].date);
          }
          if (dates.indexOf(new_daily_diet.date) === -1) {
            // if the new daily diet does not have a already existing date
            let daily_diets = doc.data().daily_diets;
            daily_diets.push(new_daily_diet);
            db.collection("patients").doc(rut).update({ daily_diets });
            return res
              .status(200)
              .json({ message: "Pauta diaria agregada con éxito." });
          } else {
            // if the new daily diet have a already existing date
            return res
              .status(400)
              .json({ error: "Ya existe una dieta diaria con esta fecha." });
          }
        } else {
          // if the patient does not have daily diets get
          db.collection("patients")
            .doc(rut)
            .update({ daily_diets: [new_daily_diet] });
          return res
            .status(200)
            .json({ message: "Dieta diaria agregada con éxito." });
        }
      } else {
        // if the patient does not exist
        return res.status(400).json({ error: "Paciente no encontrado." });
      }
    })
    .catch((error) => res.status(500).json({ error }));
});

// get all daily diets from a patient, admin or user access required
app.get("/getDailyDiet/:user/:rut", decideMiddleware, (req, res) => {
  // date format YYYY-MM-DD
  const rut = req.params.rut;
  db.doc(`/patients/${rut}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        // if the patient exists
        if (doc.data().daily_diets && doc.data().daily_diets.length > 0) {
          // if the patient has daily diets
          return res.status(200).json({ daily_diets: doc.data().daily_diets });
        } else {
          // if the patient does not have daily diets
          return res.status(200).json({ daily_diets: [] });
        }
      } else {
        // if the patient does not exist
        return res.status(404).json({ error: "Paciente no encontrado." });
      }
    })
    .catch((error) => res.status(500).json({ error }));
});

// get one daily diet from a patient, date and rut is necessary, admin or user access required
app.get("/getDailyDiet/:user/:rut/:date", decideMiddleware, (req, res) => {
  // date format YYYY-MM-DD
  const rut = req.params.rut;
  const date = new Date(req.params.date).toISOString();
  db.doc(`/patients/${rut}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        // if the patient exists
        if (doc.data().daily_diets && doc.data().daily_diets.length > 0) {
          // if the patient has daily diets
          for (let i = 0; i < doc.data().daily_diets.length; i++) {
            // if the daily diet was found
            if (doc.data().daily_diets[i].date === date) {
              return res
                .status(200)
                .json({ daily_diet: doc.data().daily_diets[i] });
            } else {
              // if the daily diet was not found
              return res.status(404).json({
                error:
                  "Este paciente no posee una pauta diaria con la fecha indicada.",
              });
            }
          }
        } else {
          return res.status(404).json({
            error: "Este paciente no cuenta con ninguna pauta diaria.",
          });
        }
      } else {
        return res.status(404).json({ error: "Paciente no encontrado." });
      }
    })
    .catch((error) => res.status(500).json({ error }));
});

// update a daily diet, admin access required
app.put("/modifyDailyDiet", AuthAdmin, (req, res) => {
  // date format YYYY-MM-DD
  const rut = req.body.rut;
  const daily_diet = {
    date: new Date(req.body.date).toISOString(),
    breakfast: {
      time: req.body.breakfast_time,
      meal: req.body.breakfast,
    },
    lunch: {
      time: req.body.lunch_time,
      meal: req.body.lunch,
    },
    snack: {
      time: req.body.snack_time,
      meal: req.body.snack,
    },
    post_training: req.body.post_training,
    dinner: {
      time: req.body.dinner_time,
      meal: req.body.dinner,
    },
    calories: req.body.calories,
    proteins: req.body.proteins,
    goals: req.body.goals,
    extra_info: req.body.extra_info,
  };

  db.doc(`/patients/${rut}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        // if the patient exists
        if (doc.data().daily_diets) {
          // if the patient has daily diets
          let toUpdate = doc.data().daily_diets;
          for (let i = 0; i < toUpdate.length; i++) {
            console.log(daily_diet.date);
            console.log(doc.data().daily_diets[i].date);
            if (doc.data().daily_diets[i].date === daily_diet.date) {
              toUpdate[i] = daily_diet;
              db.collection("patients")
                .doc(rut)
                .update({ daily_diets: toUpdate });
              return res
                .status(200)
                .json({ message: "Pauta diaria modificada." });
            }
          }
          return res.status(404).json({
            error: "No se encontro una pauta diaria con la fecha indicada.",
          });
        } else {
          // if the patient does not have daily diets
          return res.status(404).json({
            error: "Este paciente no cuenta con ninguna pauta diaria.",
          });
        }
      } else {
        return res.status(404).json({ error: "Paciente no encontrado." });
      }
    })
    .catch((error) => res.status(500).json({ error }));
});

// delete all daily diets from a patient, admin access required
app.delete("/deleteAllDailyDiets", AuthAdmin, (req, res) => {
  const rut = req.body.rut;
  db.doc(`/patients/${rut}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        // if the patient exists
        if (doc.data().daily_diets && doc.data().daily_diets.length > 0) {
          // if the patient has daily diets that must be replaced with a empty array
          db.collection("patients").doc(rut).update({ daily_diets: [] });
          return res.status(200).json({
            message:
              "Todas las pautas diarias de este usuario fueron eliminadas.",
          });
        } else {
          return res.status(404).json({
            error: "Este paciente no cuenta con ninguna pauta diaria.",
          });
        }
      } else {
        return res.status(404).json({ error: "Paciente no encontrado." });
      }
    })
    .catch((error) => res.status(500).json({ error }));
});

// delete one daily diet from a patient, admin access required
app.post("/deleteDailyDiet", AuthAdmin, (req, res) => {
  // date format YYYY-MM-DD
  const rut = req.body.rut;
  const date = new Date(req.body.date).toISOString();
  db.doc(`/patients/${rut}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        // if the patient exists
        if (doc.data().daily_diets && doc.data().daily_diets.length > 0) {
          // if the patient has daily diets
          let daily_diets = [];
          for (let i = 0; i < doc.data().daily_diets.length; i++) {
            if (doc.data().daily_diets[i].date !== date) {
              // if the daily diet is not the one you want to delete
              daily_diets.push(doc.data().daily_diets[i]);
            }
          }

          if (doc.data().daily_diets.length !== daily_diets.length) {
            // if the old array of daily diets is not the same, replace
            db.collection("patients").doc(rut).update({ daily_diets });
            return res
              .status(200)
              .json({ message: "Se ha eliminado la pauta diaria." });
          } else {
            return res.status(404).json({
              error: "No se encontro una pauta diaria con la fecha indicada.",
            });
          }
        } else {
          // if the patient does not have daily diets
          return res.status(404).json({
            error: "Este paciente no cuenta con ninguna pauta diaria.",
          });
        }
      } else {
        // if the patient does not exist
        return res.status(404).json({ error: "Paciente no encontrado." });
      }
    })
    .catch((error) => res.status(500).json({ error }));
});

module.exports = app;
