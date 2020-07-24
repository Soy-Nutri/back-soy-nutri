const express = require("express");
const app = express.Router();

const { db, firebase, admin, firebaseConfig } = require("../utils/init");
const { AuthAdmin, AuthUser } = require("../utils/middlewareAuth");

app.post("/uploadPdf/:nameFolder/:name/", (req, res) => {
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
