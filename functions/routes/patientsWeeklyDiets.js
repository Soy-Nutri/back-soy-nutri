const express = require("express");
const app = express.Router();

const { db, firebase } = require("../utils/init");
const { isEmpty } = require("../utils/functions");
const { AuthAdmin, AuthUser } = require("../utils/middlewareAuth");


app.post("/addWeeklyDiet",(req, res) => {
    const rut = req.body.rut;
    var date = req.body.date;
    var semana= req.body.semana;
    const day = req.body.day;
    const new_day = {    
        breakfast:  req.body.breakfast,
        lunch: req.body.lunch, 
        snack: req.body.snack,
        post_training: req.body.post_training,
        dinner: req.body.dinner,
       
    };

    const empty_error = "Must not be empty";

    let errors = {};
    if (isEmpty(rut)) errors.rut = empty_error;
    if (isEmpty(date)) errors.date = empty_error;
    else date = new Date(date).toISOString();
    if (isEmpty(day)) errors.day= empty_error;
    if (isEmpty(semana)) errors.semana= empty_error;
   


    if (Object.keys(errors).length > 0) return res.status(400).json(errors);
  
    db.doc(`/patients/${rut}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          
          if (doc.data().weekly_diets) {

            let semanas = [];
         
            for (let i = 0; i < doc.data().weekly_diets.length; i++) {
              semanas.push(doc.data().weekly_diets[i].semana);
             
            }
            let caca = semanas.indexOf(semana);
            let caca2 = caca !== -1;
            return res.status(504).json({ caca2 });
            if (caca != -1) {
              //Si no existe la semana
              
              db.collection("patients").doc(rut).update({weekly_diets:{semana:semana,date:date,[day]:new_day}});
              return res.status(200).json({ message: "Week and a day has been added." });
            } else {
              //si existe la semana pero faltan dias agregarlos
              

              

              return res
                .status(400)
                .json({ error: "this week is already busy." });
            }
          }else {
           
           // return res.status(405).json({weekly_diets: {date:date,semana:semana,[day]:new_day}});
            db.collection("patients")
              .doc(rut)
              .update({ weekly_diets: [ {semana:semana,date:date,[day]:new_day}] });
      
            
            return res.status(200).json({ message: "Week and a day has been added." });
          }
        } else {
          return res.status(400).json({ error: "Patient not found." });
        }
      })
      .catch((err) => res.status(500).json({ err }));
  });
 
module.exports = app;
