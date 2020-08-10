const express = require("express");
const app = express.Router();

const { db, firebase } = require("../utils/init");
const { AuthAdmin, AuthUser } = require("../utils/middlewareAuth");
const { isEmpty } = require("../utils/functions");

app.post("/signup", AuthAdmin, (req, res) => {
  const newUser = {
    rut: req.body.rut.toString(),
    names: req.body.names.toString(),
    father_last_name: req.body.father_last_name.toString(),
    mother_last_name: req.body.mother_last_name.toString(),
    city: req.body.city.toString(),
    state: "activo",
    in_date: new Date().toISOString(),
    email: req.body.email.toString(),
    phone: req.body.phone.toString(),
    birth_date: req.body.birth_date.toString(),
    sex: req.body.sex.toString(),
    alimentation: req.body.alimentation.toString(),
  };

  let errors = {};
  if (isEmpty(newUser.rut)) errors.rut = "Must no be empty";
  if (isEmpty(newUser.names)) errors.names = "Must no be empty";
  if (isEmpty(newUser.father_last_name))
    errors.father_last_name = "Must no be empty";
  if (isEmpty(newUser.mother_last_name))
    errors.mother_last_name = "Must no be empty";
  if (isEmpty(newUser.city)) errors.city = "Must no be empty";
  if (isEmpty(newUser.email)) errors.email = "Must no be empty";
  if (isEmpty(newUser.phone)) errors.phone = "Must no be empty";

  if (isEmpty(newUser.birth_date)) errors.birth_date = "Must no be empty";
  else newUser.birth_date = new Date(newUser.birth_date).toISOString();

  if (isEmpty(newUser.sex)) errors.sex = "Must no be empty";
  if (isEmpty(newUser.alimentation)) errors.alimentation = "Must no be empty";

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  let token, userId;
  db.doc(`/patients/${newUser.rut}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(409).json({ message: "Rut is already use." });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(
            `${newUser.rut}@soynutri.tk`,
            newUser.rut
          )
          .then((data) => {
            userId = data.user.uid;
            return data.user.getIdToken();
          })
          .then((tokenId) => {
            token = tokenId;
            newUser.userId = userId;
            return db.doc(`/patients/${newUser.rut}`).set(newUser);
          })
          .then(() => {
            return res.status(200).json({ token });
          })
          .catch((error) => {
            return res.status(500).json({ error: error.code });
          });
      }
    });
});

app.post("/login", (req, res) => {
  const credentials = {
    rut: req.body.rut.toString(),
    password: req.body.password.toString(),
  };

  let errors = {};
  if (isEmpty(credentials.rut)) errors.rut = "Must no be empty";
  if (isEmpty(credentials.password)) errors.password = "Must no be empty";

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  let token;
  firebase
    .auth()
    .signInWithEmailAndPassword(
      `${credentials.rut}@soynutri.tk`,
      credentials.password
    )
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((tokenID) => {
      token = tokenID;
      return db.collection("patients").doc(credentials.rut).get();
    })
    .then((doc) => {
      if (doc.data().state === "activo") {
        return res.json({
          token,
          rut: doc.data().rut,
          names: doc.data().names,
          father_last_name: doc.data().father_last_name,
          mother_last_name: doc.data().mother_last_name,
          city: doc.data().city,
          state: doc.data().state,
          in_date: doc.data().in_date,
          email: doc.data().email,
          phone: doc.data().phone,
          birth_date: doc.data().birth_date,
          sex: doc.data().sex,
          alimentation: doc.data().alimentation,
        });
      } else {
        return res.status(400).json({ error: "User inactive." });
      }
    })
    .catch((error) => {
      switch (error.code) {
        case "auth/user-not-found":
          return res.status(500).json({ error: "User not found" });
        case "auth/wrong-password":
          return res.status(500).json({ error: "Wrong password" });
        case "auth/invalid-email":
          return res.status(500).json({ error: "Invalid user" });
        default:
          return res.status(500).json({ error: error.code });
      }
    });
});

app.post("/changePassword", AuthUser, (req, res) => {
  const credentials = {
    rut: req.body.rut.toString(),
    password: req.body.password.toString(),
    newPassword: req.body.newPassword.toString(),
  };

  let errors = {};
  if (isEmpty(credentials.rut)) errors.rut = "Must no be empty";
  if (isEmpty(credentials.password)) errors.password = "Must no be empty";
  if (isEmpty(credentials.newPassword)) errors.newPassword = "Must no be empty";

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(
      `${credentials.rut}@soynutri.tk`,
      credentials.password
    )
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      firebase.auth().currentUser.updatePassword(credentials.newPassword);
      return res.status(200).json({ message: "Password change", token });
    })
    .catch((error) => {
      switch (error.code) {
        case "auth/user-not-found":
          return res.status(500).json({ error: "User not found" });
        case "auth/wrong-password":
          return res.status(500).json({ error: "Wrong password" });
        case "auth/invalid-email":
          return res.status(500).json({ error: "Invalid user" });
        default:
          return res.status(500).json({ error: error.code });
      }
    });
});

module.exports = app;
