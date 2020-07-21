const { admin, db } = require("./init");

const AuthAdmin = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    return res.status(403).json({ error: "Unauthorized" });
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      return db
        .collection("admin")
        .where("userId", "==", req.user.uid)
        .limit(1)
        .get();
    })
    .then((data) => {
      if (data._size === 0) {
        return res.status(400).json({ error: "Unauthorized" });
      }
      req.user.handle = data.docs[0].data().handle;
      return next();
    })
    .catch((err) => {
      if (err.code === "auth/id-token-expired") {
        const jwtDecode = require("jwt-decode");
        const decoded = jwtDecode(idToken);
        req.user = decoded;
        const oneDayInSeconds = 86400;
        const duration = oneDayInSeconds * 1; //three days duration
        //decoded auth time are seconds, Date now miliseconds
        if ((decoded.auth_time + duration) * 1000 < Date.now()) {
          return res.status(401).json({ message: "Token expired" });
        } else {
          return db
            .collection("admin")
            .where("userId", "==", decoded.user_id)
            .limit(1)
            .get()
            .then((data) => {
              if (data._size === 0) {
                return res.status(400).json({ error: "Unauthorized" });
              }
              req.user.handle = data.docs[0].data().handle;
              return next();
            })
            .catch((err) => {
              return res.status(400).json(err);
            });
        }
      } else {
        return res.status(400).json(err);
      }
    });
};

const AuthUser = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    return res.status(403).json({ error: "Unauthorized" });
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      return db
        .collection("patients")
        .where("userId", "==", req.user.uid)
        .limit(1)
        .get();
    })
    .then((data) => {
      if (data._size === 0) {
        return res.status(400).json({ error: "Unauthorized" });
      }
      req.user.handle = data.docs[0].data().handle;
      return next();
    })
    .catch((err) => {
      if (err.code === "auth/id-token-expired") {
        const jwtDecode = require("jwt-decode");
        const decoded = jwtDecode(idToken);
        req.user = decoded;
        const oneDayInSeconds = 86400;
        const duration = oneDayInSeconds * 30; //three days duration
        //decoded auth time are seconds, Date now miliseconds
        if ((decoded.auth_time + duration) * 1000 < Date.now()) {
          return res.status(401).json({ message: "Token expired" });
        } else {
          return db
            .collection("patients")
            .where("userId", "==", decoded.user_id)
            .limit(1)
            .get()
            .then((data) => {
              if (data._size === 0) {
                return res.status(400).json({ error: "Unauthorized" });
              }
              req.user.handle = data.docs[0].data().handle;
              return next();
            })
            .catch((err) => {
              return res.status(400).json(err);
            });
        }
      } else {
        return res.status(400).json(err);
      }
    });
};

module.exports = { AuthAdmin, AuthUser };
