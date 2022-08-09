const express = require("express");

const userController = require("../controllers/userController");

const router = express.Router();

router.get("/", (req, res) => {
    console.log(req.session);
  if (req.session.user && req.session.authenticated) {
    return res.send({ isLoggedIn: true, user: req.session.user });
  } else if(req.session.user){
    return;
  } else return res.send({ isLoggedIn: false });

});

router.post(
  "/login",
  userController.getUser,
  userController.login,
  (req, res) => {
    return res.sendStatus(200);
  }
);

router.delete("/logout", userController.logout, (req, res) => {
  return res.sendStatus(200);
});

router.post(
  "/signup",
  userController.createUser,
  userController.getUser,
  userController.login,
  (req, res) => {
    return res.sendStatus(200);
  }
);

module.exports = router;
