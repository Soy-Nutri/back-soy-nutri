const express = require("express");
const app = express.Router();

const { db, firebase } = require("../utils/init");
const { isEmpty } = require("../utils/functions");
const { AuthAdmin, AuthUser } = require("../utils/middlewareAuth");

app.post("/addDailyDiet", AuthAdmin, (req, res) => {
  const rut = req.body.rut;
  const new_daily_diet = {
    date: req.body.date,
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

  let errors = {};
  const empty_error = "Must not be empty";
  if (isEmpty(rut)) errors.rut = empty_error;
  if (isEmpty(new_daily_diet.breakfast.meal)) errors.breakfast = empty_error;
  if (isEmpty(new_daily_diet.lunch.meal)) errors.lunch = empty_error;
  if (isEmpty(new_daily_diet.snack.meal)) errors.snack = empty_error;
  if (isEmpty(new_daily_diet.post_training)) errors.post_training = empty_error;
  if (isEmpty(new_daily_diet.dinner.meal)) errors.dinner = empty_error;
  if (isEmpty(new_daily_diet.calories)) errors.calories = empty_error;
  if (isEmpty(new_daily_diet.proteins)) errors.proteins = empty_error;
  if (isEmpty(new_daily_diet.goals)) errors.goals = empty_error;
  if (isEmpty(new_daily_diet.extra_info)) errors.extra_info = empty_error;

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  db.doc(`/patients/${rut}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        if (doc.data().daily_diets) {
          let dates = [];
          for (let i = 0; i < doc.data().daily_diets.length; i++) {
            dates.push(doc.data().daily_diets[i].date);
          }
          if (dates.indexOf(new_daily_diet.date) === -1) {
            let daily_diets = doc.data().daily_diets;
            daily_diets.push(new_daily_diet);
            db.collection("patients").doc(rut).update({ daily_diets });
            return res.status(200).json({ message: "Daily diet added." });
          } else {
            return res
              .status(400)
              .json({ error: "The date of this daily diet is already taken." });
          }
        } else {
          db.collection("patients")
            .doc(rut)
            .update({ daily_diets: [new_daily_diet] });
          return res.status(200).json({ message: "Daily diet added." });
        }
      } else {
        return res.status(400).json({ error: "Patient not found." });
      }
    })
    .catch((err) => res.status(500).json({ err }));
});

module.exports = app;
