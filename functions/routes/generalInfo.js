const express = require("express");
const app = express.Router();

const { db, firebase, admin, firebaseConfig } = require("../utils/init");
const { AuthAdmin } = require("../utils/middlewareAuth");
const { isEmpty } = require("../utils/functions");

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

app.get("/getInfo", (req, res) => {
  db.collection("info")
    .doc("nutriInfo")
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(200).json(doc.data());
      } else {
        return res.status(400).json({
          error: "The information does not exist!",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
});

app.delete("/deleteInfo", (req, res) => {
  db.collection("info")
    .doc("nutriInfo")
    .get()
    .then((doc) => {
      if (doc.exists) {
        db.collection("info").doc("nutriInfo").delete();
        return res.status(200).json({
          message: "Deleted information!",
        });
      } else {
        return res.status(400).json({
          error: "There is no information!",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
});

app.post("/uploadPdf/:nameFolder/:name", AuthAdmin, (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });

  let fileName;
  let fileToBeUploaded = {};

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    // console.log(mimetype);
    if (mimetype !== "application/pdf") {
      return res.status(400).json({ error: "Wrong file type submitted" });
    }
    const extension = filename.split(".")[filename.split(".").length - 1];
    fileName = `${req.params.name}.${extension}`;
    const filepath = path.join(os.tmpdir(), extension);
    fileToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(fileToBeUploaded.filepath, {
        resumable: false,
        destination: `${req.params.nameFolder}/${fileName}`,
        metadata: {
          metadata: {
            contentType: fileToBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        const url = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${req.params.nameFolder}%2F${fileName}?alt=media`;
        return res.status(200).json({ message: url });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);
});

module.exports = app;
