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

  createregister,
);

router.post(
  "/login",

  loginUser,
);

router.get(
  "/getdetail",

  auth,
  getDetails,
);

router.get("/admin", auth, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin" });
});

router.get("/logout", logoutUser);

module.exports = router;
