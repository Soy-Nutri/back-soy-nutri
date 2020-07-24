const express = require("express");
const app = express.Router();

const { db, firebase } = require("../utils/init");
const { isEmpty } = require("../utils/functions");
const { AuthAdmin, AuthUser } = require("../utils/middlewareAuth");


app.post("/addWeeklyDiet", AuthAdmin, (req, res) => {
    const rut = req.body.rut;
    //Son 7 dias, dejarlo como coleccion de datos
    //puede quedar vacio (hay que cambiarlo esto en el front)
    const new_weekly_diet = {
      date: req.body.date,
      day:req.body.date,
      breakfast: {
        meal: req.body.breakfast,
      },
      lunch: {
        time: req.body.lunch_time,
        meal: req.body.lunch,
      },
      snack: {
        meal: req.body.snack,
      },
      post_training: req.body.post_training,
      dinner: {
        meal: req.body.dinner,
      }


    };
  
    let errors = {};
    const empty_error = "Must not be empty";


    if (Object.keys(errors).length > 0) return res.status(400).json(errors);
  
    db.doc(`/patients/${rut}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          if (doc.data().weekly_diets) {
            let dates = [];
            for (let i = 0; i < doc.data().weekly_diets.length; i++) {
              dates.push(doc.data().weekly_diets[i].date);
            }
            if (dates.indexOf(new_weekly_diet.date) === -1) {
              let weekly_diets = doc.data().weekly_diets;
              weekly_diets.push(new_weekly_diet);
              db.collection("patients").doc(rut).update({ weekly_diets });
              return res.status(200).json({ message: "Daily diet added." });
            } else {
              return res
                .status(400)
                .json({ error: "The date of this daily diet is already taken." });
            }
          } else {
            db.collection("patients")
              .doc(rut)
              .update({ weekly_diets: [new_weekly_diet] });
            return res.status(200).json({ message: "Daily diet added." });
          }
        } else {
          return res.status(400).json({ error: "Patient not found." });
        }
      })
      .catch((err) => res.status(500).json({ err }));
  });



  //modificar con el put //
module.exports = app;
