const express = require("express");
const router = express.Router();

const {
  createregister,
  loginUser,
  getDetails,
  logoutUser,
} = require("../controller/register");

const authmiddleware = require("../middleware/authmiddleware");
const authorizeRoles = require("../middleware/roleBaseMiddleware");

router.post("/register", createregister);
router.post("/login", loginUser);
router.get("/getdetail", authmiddleware, getDetails);

router.get("/admin", authmiddleware, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin" });
});

router.get("/logout", logoutUser);

module.exports = router;
