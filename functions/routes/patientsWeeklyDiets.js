const express = require("express");
const app = express.Router();

const { db, firebase } = require("../utils/init");
const { isEmpty } = require("../utils/functions");
const { AuthAdmin, AuthUser } = require("../utils/middlewareAuth");


function removeItemFromArr( arr, item ) {
  return arr.filter( function( e ) {
      return e !== item;
  } );
};

/*Convencion:
las semanas comienzan los lunes.
se agregan en español. 
*/

app.post("/addWeeklyDiet", AuthAdmin,(req, res) => {
    const rut = req.body.rut;
    var date = req.body.date;
    const day = (req.body.day).toLowerCase();
    const new_day = {    
        breakfast:  req.body.breakfast,
        lunch: req.body.lunch, 
        snack: req.body.snack,
        post_training: req.body.post_training,
        dinner: req.body.dinner,
       
    };


    const days_of_week=["lunes","martes","miercoles","jueves","viernes","sabado","domingo","lúnes","miércoles","sábado"];
    const empty_error = "Must not be empty";
    let errors = {};
    if (isEmpty(rut)) errors.rut = empty_error;
    if (isEmpty(date)) errors.date = empty_error;
    else date = new Date(date).toISOString();
    if (isEmpty(day)){
      errors.day= empty_error;
    } 
    if(days_of_week.indexOf(day)===-1) {
      return res.status(608).json("Day does not exist."); 
    }

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
            let actual_week= dates.indexOf(date); 
            if (actual_week === -1) {
              //caso de que  no exista la fecha
              let weekly_diets = doc.data().weekly_diets;
              weekly_diets.push({date:date,[day]:new_day});
              db.collection("patients").doc(rut).update({weekly_diets});
              return res.status(200).json({ message: "Week and day has been added." });

            } else {
              let days=Object.keys(doc.data().weekly_diets[actual_week]);
               //de que no exista la semana ni tenga dias ni fechas cosa q no deberia pasar nunca 
               //pero igual se comprueba por si acaso 
              if (days.length == 0){
                db.collection("patients").doc(rut).update({weekly_diets:{date:date,[day]:new_day}});
                return res.status(200).json({ message: "Added "+ day });
              }

              else{

                let ndays = removeItemFromArr(days,"date");    
                if(ndays.length>=7){
                  return res
                  .status(400)
                  .json({ error: "The week can not have more than 7 days." });
                }
                else{
                  if(ndays.indexOf(day)!== -1 ){
                    return res.status(501).json({ message: "The day that you are posting is already here." });
                  }
                  else{
                    for (let i = 0; i <ndays.length; i++) {    
                      let weekly_diets = doc.data().weekly_diets;
                      if(day==days_of_week[0]||day==days_of_week[7] ){
                        weekly_diets[actual_week][day] =new_day ;
                        db.collection("patients").doc(rut).update({weekly_diets});
                        return res.status(600).json({ message: "Added monday." });
                      } 
                      else if(day==days_of_week[1]){
                        weekly_diets[actual_week][day] =new_day ;
                        db.collection("patients").doc(rut).update({weekly_diets});
                        return res.status(600).json({ message: "Added thuesday." });
                      } 
                      else if(day==days_of_week[2]||day==days_of_week[8]){
                        weekly_diets[actual_week][day] =new_day ;
                        db.collection("patients").doc(rut).update({weekly_diets});
                        return res.status(601).json({ message: "Added wednesday." });
                      }
                      else if(day==days_of_week[3]){    
                        weekly_diets[actual_week][day] =new_day ;
                        db.collection("patients").doc(rut).update({weekly_diets});
                        return res.status(602).json({ message: "Added thursday." });
                      }
                      else if(day==days_of_week[4]){
                        weekly_diets[actual_week][day] =new_day ;
                        db.collection("patients").doc(rut).update({weekly_diets});
                        return res.status(603).json({ message: "Added friday." });
                      }
                      else if(day==days_of_week[5]||day==days_of_week[9]){
                        weekly_diets[actual_week][day] =new_day ;
                        db.collection("patients").doc(rut).update({weekly_diets});
                        return res.status(604).json({ message: "Added saturday." });
                      }
                      else if(day==days_of_week[6]){
                        weekly_diets[actual_week][day] =new_day ;
                        db.collection("patients").doc(rut).update({weekly_diets});
                        return res.status(605).json({ message: "Added sunday" });
                      }
                      else{
                        return res.status(606).json({ message: "This day does not exist." });
                      }
                    }
                  }
                }       
              }
            }
          }else {
           //Si la semana no esta creada  por primera vez
           db.collection("patients")
              .doc(rut)
              .update({ weekly_diets: [ {date:date,[day]:new_day}] });
      
            
            return res.status(200).json({ message: "Week and a day has been added!." });
          }
        } else {
          return res.status(400).json({ error: "Patient not found." });
        }
      })
      .catch((err) => res.status(500).json({ err }));
  });
//hola
module.exports = app;
