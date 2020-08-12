const express = require("express");
const app = express.Router();

const { db, firebase } = require("../utils/init");
const { isEmpty, normalize } = require("../utils/functions");
const { AuthAdmin, decideMiddleware } = require("../utils/middlewareAuth");

function removeItemFromArr(arr, item) {
  return arr.filter(function (e) {
    return e !== item;
  });
}

/*Convencion:
las semanas comienzan los lunes.
se agregan en español. 
*/

app.post("/addWeeklyDiet", AuthAdmin, (req, res) => {
  const rut = req.body.rut;
  var date = req.body.date;
  const day = normalize(req.body.day.toLowerCase());
  const new_day = {
    breakfast: req.body.breakfast,
    timeBreakfast: req.body.timeBreakfast,
    lunch: req.body.lunch,
    timeLunch: req.body.timeLunch,
    snack: req.body.snack,
    timeSnack: req.body.timeSnack,
    post_training: req.body.post_training,
    dinner: req.body.dinner,
    timeDinner: req.body.timeDinner,
  };

  const days_of_week = [
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
    "domingo",
  ];
  const empty_error = "Must not be empty";
  let errors = {};
  if (isEmpty(rut)) errors.rut = empty_error;
  if (isEmpty(date)) errors.date = empty_error;
  else date = new Date(date).toISOString();
  if (isEmpty(day)) {
    errors.day = empty_error;
  }
  if (days_of_week.indexOf(day) === -1) {
    return res.status(608).json({ message: "Day does not exist." });
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
          let actual_week = dates.indexOf(date);
          if (actual_week === -1) {
            //caso de que  no exista la fecha
            let weekly_diets = doc.data().weekly_diets;
            weekly_diets.push({ date: date, [day]: new_day });
            db.collection("patients").doc(rut).update({ weekly_diets });
            return res
              .status(200)
              .json({ message: "Week and day has been added." });
          } else {
            let days = Object.keys(doc.data().weekly_diets[actual_week]);
            //de que no exista la semana ni tenga dias ni fechas cosa q no deberia pasar nunca
            //pero igual se comprueba por si acaso
            if (days.length == 0) {
              db.collection("patients")
                .doc(rut)
                .update({ weekly_diets: { date: date, [day]: new_day } });
              return res.status(200).json({ message: "Added " + day });
            } else {
              let ndays = removeItemFromArr(days, "date");
              if (ndays.length >= 7) {
                return res
                  .status(400)
                  .json({ error: "The week can not have more than 7 days." });
              } else {
                if (ndays.indexOf(day) !== -1) {
                  return res.status(501).json({
                    message: "The day that you are posting is already here.",
                  });
                } else {
                  for (let i = 0; i < ndays.length; i++) {
                    let weekly_diets = doc.data().weekly_diets;
                    if (day == days_of_week[0] || day == days_of_week[7]) {
                      weekly_diets[actual_week][day] = new_day;
                      db.collection("patients")
                        .doc(rut)
                        .update({ weekly_diets });
                      return res.status(600).json({ message: "Added monday." });
                    } else if (day == days_of_week[1]) {
                      weekly_diets[actual_week][day] = new_day;
                      db.collection("patients")
                        .doc(rut)
                        .update({ weekly_diets });
                      return res
                        .status(600)
                        .json({ message: "Added thuesday." });
                    } else if (
                      day == days_of_week[2] ||
                      day == days_of_week[8]
                    ) {
                      weekly_diets[actual_week][day] = new_day;
                      db.collection("patients")
                        .doc(rut)
                        .update({ weekly_diets });
                      return res
                        .status(601)
                        .json({ message: "Added wednesday." });
                    } else if (day == days_of_week[3]) {
                      weekly_diets[actual_week][day] = new_day;
                      db.collection("patients")
                        .doc(rut)
                        .update({ weekly_diets });
                      return res
                        .status(602)
                        .json({ message: "Added thursday." });
                    } else if (day == days_of_week[4]) {
                      weekly_diets[actual_week][day] = new_day;
                      db.collection("patients")
                        .doc(rut)
                        .update({ weekly_diets });
                      return res.status(603).json({ message: "Added friday." });
                    } else if (
                      day == days_of_week[5] ||
                      day == days_of_week[9]
                    ) {
                      weekly_diets[actual_week][day] = new_day;
                      db.collection("patients")
                        .doc(rut)
                        .update({ weekly_diets });
                      return res
                        .status(604)
                        .json({ message: "Added saturday." });
                    } else if (day == days_of_week[6]) {
                      weekly_diets[actual_week][day] = new_day;
                      db.collection("patients")
                        .doc(rut)
                        .update({ weekly_diets });
                      return res.status(605).json({ message: "Added sunday" });
                    } else {
                      return res
                        .status(606)
                        .json({ message: "This day does not exist." });
                    }
                  }
                }
              }
            }
          }
        } else {
          //Si la semana no esta creada  por primera vez
          db.collection("patients")
            .doc(rut)
            .update({ weekly_diets: [{ date: date, [day]: new_day }] });

          return res
            .status(200)
            .json({ message: "Week and a day has been added!." });
        }
      } else {
        return res.status(400).json({ error: "Patient not found." });
      }
    })
    .catch((err) => res.status(500).json({ err }));
});

app.get("/getWeeklyDiets/:rut/:user", decideMiddleware, (req, res) => {
  const rut = req.params.rut;
  db.doc(`/patients/${rut}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        if (doc.data().weekly_diets === undefined) {
          return res
            .status(400)
            .json({ message: "This patient not have weekly diets." });
        } else {
          return res
            .status(200)
            .json({ Weekly_Diets: doc.data().weekly_diets });
        }
      } else {
        return res.status(400).json({ message: "Weekly diets not found." });
      }
    });
});

app.get("/getWeeklyDiets/:rut/:date/:user", decideMiddleware, (req, res) => {
  const rut = req.params.rut;
  const date = req.params.date;
  db.doc(`/patients/${rut}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        if (doc.data().weekly_diets === undefined) {
          return res
            .status(400)
            .json({ message: "This patient not have weekly diets." });
        } else {
          for (let i = 0; i < doc.data().weekly_diets.length; i++) {
            if (
              doc.data().weekly_diets[i].date ===
              new Date(date + "T04:00:00.000Z").toISOString()
            ) {
              return res
                .status(200)
                .json({ Weekly_Diet: doc.data().weekly_diets[i] });
            }
          }
          return res.status(400).json({ message: "Weekly diets not found." });
        }
      } else {
        return res.status(400).json({ message: "Weekly diets not found." });
      }
    });
});

app.put("/modifyWeeklyDiets", AuthAdmin, (req, res) => {
  const rut = req.body.rut;
  var date = req.body.date;
  const day = normalize(req.body.day.toLowerCase());
  const day_info = {
    breakfast: req.body.breakfast,
    timeBreakfast: req.body.timeBreakfast,
    lunch: req.body.lunch,
    timeLunch: req.body.timeLunch,
    snack: req.body.snack,
    timeSnack: req.body.timeSnack,
    post_training: req.body.post_training,
    dinner: req.body.dinner,
    timeDinner: req.body.timeDinner,
  };

  const days_of_week = [
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
    "domingo",
  ];
  const empty_error = "Must not be empty";
  let errors = {};
  if (isEmpty(rut)) errors.rut = empty_error;
  if (isEmpty(date)) errors.date = empty_error;
  else date = new Date(date).toISOString();
  if (isEmpty(day)) {
    errors.day = empty_error;
  }
  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  if (days_of_week.indexOf(day) === -1) {
    return res.status(408).json({ message: "Day does not exist." });
  }

  db.doc(`/patients/${rut}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        if (doc.data().weekly_diets) {
          let id = -1;
          for (let i = 0; i < doc.data().weekly_diets.length; i++) {
            if (doc.data().weekly_diets[i].date === date) {
              id = i;
            }
          }
          if (id !== -1) {
            let new_day = doc.data().weekly_diets;
            if (day in new_day[id]) {
              if (day_info.breakfast !== "") {
                new_day[id][day].breakfast = day_info.breakfast;
              }
              if (day_info.timeBreakfast !== "") {
                new_day[id][day].timeBreakfast = day_info.timeBreakfast;
              }

              if (day_info.lunch !== "") {
                new_day[id][day].lunch = day_info.lunch;
              }
              if (day_info.timeLunch !== "") {
                new_day[id][day].timeLunch = day_info.timeLunch;
              }

              if (day_info.snack !== "") {
                new_day[id][day].snack = day_info.snack;
              }
              if (day_info.timeSnack !== "") {
                new_day[id][day].timeSnack = day_info.timeSnack;
              }

              if (day_info.post_training !== "") {
                new_day[id][day].post_training = day_info.post_training;
              }

              if (day_info.dinner !== "") {
                new_day[id][day].dinner = day_info.dinner;
              }
              if (day_info.timeDinner !== "") {
                new_day[id][day].timeDinner = day_info.timeDinner;
              }
              db.doc(`/patients/${rut}`).update({ weekly_diets: new_day });
              return res.status(200).json({ message: "Change data." });
            } else {
              return res.status(404).json({ message: "Day not found." });
            }
          } else {
            return res.status(404).json({ message: "Date not found." });
          }
        } else {
          return res.status(404).json({ message: "Weekly diets not found." });
        }
      } else {
        return res.status(404).json({ message: "Patients not found." });
      }
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
});

app.delete("/deleteWeeklyDiets", AuthAdmin, (req, res) => {
  const rut = req.body.rut;
  var date = req.body.date;
  const day = normalize(req.body.day.toLowerCase());
  const days_of_week = [
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
    "domingo",
  ];
  const empty_error = "Must not be empty";
  let errors = {};
  if (isEmpty(rut)) errors.rut = empty_error;
  if (isEmpty(date)) errors.date = empty_error;
  else date = new Date(date).toISOString();
  if (isEmpty(day)) {
    errors.day = empty_error;
  }
  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  if (days_of_week.indexOf(day) === -1) {
    return res.status(408).json({ message: "Day does not exist." });
  }

  db.doc(`/patients/${rut}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        if (doc.data().weekly_diets) {
          let id = -1;
          for (let i = 0; i < doc.data().weekly_diets.length; i++) {
            if (doc.data().weekly_diets[i].date === date) {
              id = i;
            }
          }
          if (id !== -1) {
            let new_day = doc.data().weekly_diets;
            if (day in new_day[id]) {
              delete new_day[id][day];
              db.doc(`/patients/${rut}`).update({ weekly_diets: new_day });
              return res.status(200).json({ message: "Day delete." });
            } else {
              return res.status(404).json({ message: "Day not found." });
            }
          } else {
            return res.status(404).json({ message: "Date not found." });
          }
        } else {
          return res.status(404).json({ message: "Weekly diets not found." });
        }
      } else {
        return res.status(404).json({ message: "Patients not found." });
      }
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
});

app.delete("/deleteWeekOfWeeklyDiets", AuthAdmin, (req, res) => {
  const rut = req.body.rut;
  var date = req.body.date;

  const empty_error = "Must not be empty";
  let errors = {};
  if (isEmpty(rut)) errors.rut = empty_error;
  if (isEmpty(date)) errors.date = empty_error;
  else date = new Date(date).toISOString();
  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  db.doc(`/patients/${rut}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        if (doc.data().weekly_diets) {
          let new_weekly = [];
          for (let i = 0; i < doc.data().weekly_diets.length; i++) {
            if (doc.data().weekly_diets[i].date !== date) {
              new_weekly.push(doc.data().weekly_diets[i]);
            }
          }
          if (new_weekly.length !== doc.data().weekly_diets.length) {
            db.doc(`/patients/${rut}`).update({ weekly_diets: new_weekly });
            return res.status(200).json({ message: "Delete Week." });
          } else {
            return res.status(404).json({ message: "Weekly diets not found." });
          }
        } else {
          return res.status(404).json({ message: "Weekly diets not found." });
        }
      } else {
        return res.status(404).json({ message: "Patients not found." });
      }
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
});

app.delete("/deleteAllWeeklyDiets", AuthAdmin, (req, res) => {
  const rut = req.body.rut;

  const empty_error = "Must not be empty";
  let errors = {};
  if (isEmpty(rut)) errors.rut = empty_error;
  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  db.doc(`/patients/${rut}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        if (doc.data().weekly_diets) {
          db.doc(`/patients/${rut}`).update({ weekly_diets: [] });
          return res.status(200).json({ message: "Delete Week." });
        } else {
          return res.status(404).json({ message: "Weekly diets not found." });
        }
      } else {
        return res.status(404).json({ message: "Patients not found." });
      }
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
});

module.exports = app;
