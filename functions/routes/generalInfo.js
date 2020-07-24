const express = require("express");
const app = express.Router();

const { db, firebase } = require("../utils/init");
const { AuthAdmin, AuthUser } = require("../utils/middlewareAuth");
const middlewareAuth = require("../utils/middlewareAuth");

app.post("/addInfo", (req, res) => {
  const info = {
    nutriName: req.body.nutriName,
    academicInfo: req.body.academicInfo,
    phoneNumber: req.body.phoneNumber,
    consultAddress: req.body.consultAddress,
    instagramProfile: req.body.instagramProfile,
  };
  let errors = {};
  if (isEmpty(info.nutriName)) errors.nutriName = "Must no be empty";
  if (isEmpty(info.academicInfo)) errors.academicInfo = "Must no be empty";
  if (isEmpty(info.phoneNumber)) errors.phoneNumber = "Must no be empty";
  if (isEmpty(info.consultAddress)) errors.consultAddress = "Must no be empty";
  if (isEmpty(info.instagramProfile))
    errors.instagramProfile = "Must no be empty";
  if (Object.keys(errors).length > 0) return res.status(400).json(errors);
  db.collection("info")
    .doc("nutriInfo")
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(400).json({
          error: "It already exists!",
        });
      } else {
        db.collection("info").doc("nutriInfo").set(info);
        return res.status(200).json({
          message: "Aggregate information!",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
});

module.exports = app;
