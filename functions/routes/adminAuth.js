const express = require("express");
const app = express.Router();

const { db, firebase } = require("../utils/init");
const { AuthAdmin } = require("../utils/middlewareAuth");
const { isEmpty } = require("../utils/functions");

app.post("/signup", (req, res) => {
  const credentials = {
    rut: req.body.rut.toString(),
    password: req.body.password.toString(),
    name: req.body.name.toString(),
  };

  let errors = {};
  if (isEmpty(credentials.rut)) errors.rut = "Must no be empty";
  if (isEmpty(credentials.password)) errors.password = "Must no be empty";
  if (isEmpty(credentials.name)) errors.name = "Must no be empty";

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  let token, userId;
  db.collection("admin")
    .get()
    .then((snapshot) => {
      if (snapshot._size === 0) {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(
            `${credentials.rut}@soynutriadmin.tk`,
            credentials.password
          )
          .then((data) => {
            userId = data.user.uid;
            return data.user.getIdToken();
          })
          .then((tokenId) => {
            token = tokenId;
            const newUser = {
              rut: credentials.rut,
              createdAt: new Date().toISOString(),
              name: credentials.name,
              userId: userId,
            };
            return db.doc(`/admin/${newUser.rut}`).set(newUser);
          })
          .then(() => {
            return res.status(200).json({ token });
          })
          .catch((error) => {
            return res.status(500).json({ error: error.code });
          });
      } else {
        return res.status(409).json({ message: "Limit reached of admin." });
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
      `${credentials.rut}@soynutriadmin.tk`,
      credentials.password
    )
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((tokenID) => {
      token = tokenID;
      return db.collection("admin").doc(credentials.rut).get();
    })
    .then((doc) => {
      return res.status(200).json({
        token,
        rut: doc.data().rut,
      });
    })
    .catch((error) => {
      switch (error.code) {
        case "auth/user-not-found":
          return res.status(404).json({ error: "User not found" });
        case "auth/wrong-password":
          return res.status(409).json({ error: "Wrong password" });
        case "auth/invalid-email":
          return res.status(409).json({ error: "Invalid user" });
        default:
          return res.status(500).json({ error: error.code });
      }
    });
});

app.post("/changePassword", AuthAdmin, (req, res) => {
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
      `${credentials.rut}@soynutriadmin.tk`,
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
          return res.status(404).json({ error: "User not found" });
        case "auth/wrong-password":
          return res.status(409).json({ error: "Wrong password" });
        case "auth/invalid-email":
          return res.status(409).json({ error: "Invalid user" });
        default:
          return res.status(500).json({ error: error.code });
      }
    });
});

module.exports = app;
