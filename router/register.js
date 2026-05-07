const express = require("express");
const router = express.Router();

const {
  createregister,
  loginUser,
  getDetails,
  logoutUser,
} = require("../controller/register");

const auth = require("../middleware/authmiddleware");
const authorizeRoles = require("../middleware/roleBaseMiddleware");

router.post(
  "/register",
  (req, res, next) => {
    console.log("REGISTER API HIT");
    next();
  },
  createregister,
);

router.post(
  "/login",
  (req, res, next) => {
    console.log("LOGIN API HIT");
    next();
  },
  loginUser,
);

router.get(
  "/getdetail",
  (req, res, next) => {
    console.log("GETDETAIL API HIT");
    next();
  },
  auth,
  getDetails,
);

router.get("/admin", auth, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin" });
});

router.get("/logout", logoutUser);

module.exports = router;
