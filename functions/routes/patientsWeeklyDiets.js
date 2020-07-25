const express = require("express");
const app = express.Router();

const { db, firebase } = require("../utils/init");
const { isEmpty } = require("../utils/functions");
const { AuthAdmin, AuthUser } = require("../utils/middlewareAuth");


app.post("/addWeeklyDiet",(req, res) => {
    const rut = req.body.rut;
    var date = req.body.date;
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



    if (Object.keys(errors).length > 0) return res.status(400).json(errors);
  
    db.doc(`/patients/${rut}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          
          if (doc.data().weekly_diet) {

            let dates = [];
            for (let i = 0; i < doc.data().weekly_diet.length; i++) {
              dates.push(doc.data().weekly_diet[i].date);
            }

            if (dates.indexOf(date) !== -1) {
              let weekly_diet = doc.data().weekly_diet;
              

              //Hacer comprobacion de que el dia que se este ingresando
              //no exista ya en la semana del weekly diet


              if(day=="martes" ){
                let tuesday=new_day ;
                weekly_diet.push(tuesday);
              }
              else if(day=="miercoles"){
                let wednesday=new_day ;
                weekly_diet.push(wednesday);

              }
              else if(day=="jueves"){
                let thursday=new_day ;
                weekly_diet.push(thursday);

              }
              else if(day=="viernes"){
                let friday=new_day ;
                weekly_diet.push(friday);

              }
              else if(day=="sabado"){
                let saturday=new_day ;
                weekly_diet.push(saturday);

              }
              else if(day=="domingo"){
                let sunday=new_day ;
                weekly_diet.push(sunday);
              }
              
              db.collection("patients").doc(rut).update({weekly_diet});
              return res.status(200).json({ message: "Weekly diet and a day has been added." });
            } else {
              //ya que no existe la fecha ingresada agregar que abajo
              return res
                .status(400)
                .json({ error: "The date of this Weekly diet is already taken." });
            }
          }else {
            let monday = new_day;
           // return res.status(405).json({date:date,[day]:new_day});
            db.collection("patients")
              .doc(rut)
              .update({ weekly_diet: [ {date:date,[day]:new_day}] });
      
            
            return res.status(200).json({ message: "Daily diet added." });
          }
        } else {
          return res.status(400).json({ error: "Patient not found." });
        }
      })
      .catch((err) => res.status(500).json({ err }));
  });
 
module.exports = app;
